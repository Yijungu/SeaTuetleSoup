from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
import openai
from .models import SeaTurtle, Keyword
from datetime import datetime

openai.api_key = "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"

turbo_llm = ChatOpenAI(
    temperature=0,
    model_name='gpt-3.5-turbo'
)
embeddings = OpenAIEmbeddings(openai_api_key="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")
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

loader = TextLoader("1.txt")
documents = loader.load()
texts = text_splitter.split_documents(documents)
docsearch = Chroma.from_documents(texts, embeddings)
qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm,
                    chain_type="stuff",
                    retriever=docsearch.as_retriever(),
                    return_source_documents=True)
keywords = []
answer_plus = ""
problem = ""

def question(query):
    query += "추론 할 수 있는 건 추론하고 대답은 네 아니오 그럴겁니다 아닐겁니다 대답해. 설명은 하지마"
    llm_response = qa_chain(query)
    return llm_response['result']

def submit(answer):
    content += "이 문장 안에 건축가에 대한 이야기가 들어가 있어? 네 아니오로만 대답해줘"
    completion = openai.ChatCompletion.create(
      model = "gpt-3.5-turbo",
      messages = {"role" : "user", "content": content}
    )
    chat_response = completion.choices[0].message.content
    return chat_response

def answer_plus_edit():
    answer_plus = "이 문장 안에 "
    for keyword in keywords:
        answer_plus += keyword
        answer_plus += " "
    answer_plus += " 대한 이야기가 들어가 있어? 네 아니오로만 대답해줘"
    return 0

def get_story():

    today = datetime.today().day
    seaturtle = SeaTurtle.objects.filter(date = today)
    story = [seaturtle[0].story]
    title = str(today) + ".txt"
    with open(title, 'w') as f:
        for sentence in story:
            f.write(sentence + '\n')
    loader = TextLoader(title)
    documents = loader.load()
    texts = text_splitter.split_documents(documents)
    docsearch = Chroma.from_documents(texts, embeddings)
    qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm,
                                  chain_type="stuff",
                                  retriever=docsearch.as_retriever(),
                                  return_source_documents=True)
    problem = seaturtle[0].problem
    keywords = list(Keyword.objects.filter(date = today))
    
    answer_plus_edit()

    return 0