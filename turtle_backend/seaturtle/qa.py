from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
import os
import sys
import urllib.request
import json

os.environ["OPENAI_API_KEY"] = "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"

client_id = "YJapoM9m6N8i3Tnk6gmn" # 개발자센터에서 발급받은 Client ID 값
client_secret = "NKmaZhueS_" # 개발자센터에서 발급받은 Client Secret 값
url = "https://openapi.naver.com/v1/papago/n2mt"
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id",client_id)
request.add_header("X-Naver-Client-Secret",client_secret)

turbo_llm = ChatOpenAI(
    temperature=0,
    model_name='gpt-3.5-turbo'
    max_tokens=4097
)

loader = TextLoader("myfile4_kr.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings(openai_api_key="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")
docsearch = Chroma.from_documents(texts, embeddings)

qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm,
                                  chain_type="stuff",
                                  retriever=docsearch.as_retriever(),
                                  return_source_documents=True)

qa = RetrievalQA.from_chain_type(llm=OpenAI(openai_api_key="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"), chain_type="stuff", retriever=docsearch.as_retriever())
def Question(query):
    llm_response = qa_chain(query)
    return llm_response['result']

def Submit(answer):
    llm_response = qa.run(answer)
    return llm_response

