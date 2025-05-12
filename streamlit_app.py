import streamlit as st
import time
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
import os

# Performance optimization 1: Add caching to expensive operations
@st.cache_resource
def get_llm_model():
    return OpenAI(temperature=0, openai_api_key=os.environ.get("OPENAI_API_KEY"))

@st.cache_resource
def get_conversation_chain():
    llm = get_llm_model()
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        memory=memory,
    )
    return conversation_chain

# App title
st.title("🤖 AI Chatbot")

# Initialize session state variables if they don't exist
if "messages" not in st.session_state:
    st.session_state.messages = []
if "conversation" not in st.session_state:
    st.session_state.conversation = get_conversation_chain()

# Display chat messages from history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# User input
if prompt := st.chat_input("Ask something"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Display user message in chat container
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Display assistant response in chat container
    with st.chat_message("assistant"):
        # Performance optimization 2: Use a placeholder for streaming effect
        message_placeholder = st.empty()
        full_response = ""
        
        # Performance optimization 3: Process the response
        response = st.session_state.conversation({"question": prompt})
        assistant_response = response['answer']
        
        # Simulate streaming for better UX while processing
        for chunk in assistant_response.split():
            full_response += chunk + " "
            time.sleep(0.01)  # Reduced delay for faster response
            message_placeholder.markdown(full_response + "▌")
        
        message_placeholder.markdown(assistant_response)
    
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": assistant_response})

# Performance optimization 4: Add a sidebar with minimal widgets to reduce rendering load
with st.sidebar:
    st.header("Settings")
    if st.button("Clear Conversation"):
        st.session_state.messages = []
        st.session_state.conversation = get_conversation_chain()
