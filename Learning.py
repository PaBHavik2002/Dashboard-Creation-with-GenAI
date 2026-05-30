# Basic Utilities
import os
import re
import uuid
from typing import List, Dict, Any, Optional
import shutil
from PyPDF2 import PdfReader
import chromadb

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# File object
pdfsPath = [r"C:\Users\Bhavik Parmar\Downloads\rag_retrieval_test_document.pdf"]

# PDF Text extracter
def load_pdfs(pdf_paths: List[str]):
    """
    Loads PDFs using LangChain PyPDFLoader.
    Each PDF page becomes a LangChain Document object.

    Output:
    List of Document objects with:
    - page_content
    - metadata
    """
    documents = []

    for pdf_path in pdf_paths:
        loader = PyPDFLoader(pdf_path)
        pdf_documents = loader.load()

        source_file = os.path.basename(pdf_path)

        for doc in pdf_documents:
            doc.metadata["source_file"] = source_file
            doc.metadata["source_path"] = pdf_path

        documents.extend(pdf_documents)

    print(f"Loaded {len(documents)} pages from {len(pdf_paths)} PDF file(s).")
    return documents

# Recurcive Text collector to create chunks
def split_documents_recursively(
    documents,
    chunk_size: int = 1000,
    chunk_overlap: int = 200
):
    """
    Splits loaded PDF documents using RecursiveCharacterTextSplitter.

    chunk_size = max characters per chunk
    chunk_overlap = repeated characters between chunks
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=[
            "\n\n",   # paragraph break
            "\n",     # line break
            ". ",     # sentence-like break
            " ",      # word break
            ""        # character fallback
        ],
        length_function=len,
        add_start_index=True
    )

    chunks = splitter.split_documents(documents)

    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_index"] = i
        chunk.metadata["chunking_strategy"] = "recursive_character"
        chunk.metadata["chunk_size"] = chunk_size
        chunk.metadata["chunk_overlap"] = chunk_overlap

    print(f"Created {len(chunks)} chunks.")
    return chunks

# Embedding model creation
def get_embedding_model():
    """
    Creates the embedding model.
    all-MiniLM-L6-v2 is lightweight and good for local testing.
    """
    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    return embedding_model

# Storing the vectors to the db
def store_chunks_in_chromadb(
    chunks,
    persist_directory: str = "./chromadb_store",
    collection_name: str = "chromdb"
):
    """
    Stores chunks into ChromaDB.
    """
    embedding_model = get_embedding_model()

    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        collection_name=collection_name,
        persist_directory=persist_directory
    )

    print(f"Stored {len(chunks)} chunks in ChromaDB collection: {collection_name}")

    return vector_db

# Full pipeline execution
def build_rag_preprocessing_pipeline(
    pdf_paths: List[str],
    persist_directory: str = "./chromadb_store",
    collection_name: str = "chromdb",
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    reset_db: bool = True
):
    """
    Full RAG preprocessing pipeline:

    1. Optionally delete old ChromaDB storage
    2. Load PDFs
    3. Split documents into recursive chunks
    4. Create embeddings
    5. Store chunks in ChromaDB
    """

    documents = load_pdfs(pdf_paths)

    chunks = split_documents_recursively(
        documents=documents,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )

    vector_db = store_chunks_in_chromadb(
        chunks=chunks,
        persist_directory=persist_directory,
        collection_name=collection_name
    )

    return vector_db, chunks

# Retrival Function
def retrieve_from_chromadb(
    vector_db,
    query: str,
    k: int = 5,
    source_file: Optional[str] = None
):
    """
    Retrieves relevant chunks from ChromaDB.

    source_file is optional.
    If provided, retrieval will only search within that PDF.
    """

    search_filter = None

    if source_file:
        search_filter = {"source_file": source_file}

    results = vector_db.similarity_search_with_score(
        query=query,
        k=k,
        filter=search_filter
    )

    for rank, (doc, score) in enumerate(results, start=1):
        print(f"\nRank: {rank}")
        print(f"Distance: {score}")
        print(f"Source File: {doc.metadata.get('source_file')}")
        print(f"Page: {doc.metadata.get('page')}")
        print(f"Chunk Index: {doc.metadata.get('chunk_index')}")
        print("-" * 80)
        print(doc.page_content[:1200])
        print("-" * 80)

    return results

# Retrival In Run
vector_db, chunks = build_rag_preprocessing_pipeline(
    pdf_paths=pdfsPath,
    persist_directory="./chromadb_store",
    collection_name="chromdb",
    chunk_size=700,
    chunk_overlap=50,
    reset_db=True
)

results = retrieve_from_chromadb(
    vector_db=vector_db,
    query="What are the retrival quality indicators?",
    k=3,
    source_file="rag_retrieval_test_document.pdf"
)

for doc, score in results:
    print("Distance:", score)
    print("Source:", doc.metadata.get("source_file"))
    print("Page:", doc.metadata.get("page"))
    print("Chunk:", doc.metadata.get("chunk_index"))
    print(doc.page_content[:1000])
    print("-" * 100)