from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.grammar_fix import router as grammar_fix_router
from app.api.summarizer import router as summarizer_router
from app.api.text_merge import router as text_merge_router
from app.api.translator import router as translator_router
from app.api.dictionary import router as dictionary_router

app = FastAPI()

app.include_router(text_merge_router)
app.include_router(grammar_fix_router)
app.include_router(summarizer_router)
app.include_router(translator_router)
app.include_router(dictionary_router)

app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static",
)


@app.get("/")
def root():
    return FileResponse("app/templates/index.html")

@app.get("/text-merge")
def merge_text_page():
    return FileResponse("app/templates/index.html")

@app.get("/grammar-fix")
def grammar_fix_page():
    return FileResponse("app/templates/index.html")

@app.get("/translator")
def translator_page():
    return FileResponse("app/templates/index.html")

@app.get("/summarizer")
def summarize_page():
    return FileResponse("app/templates/index.html")

@app.get("/dictionary")
def dictionary_page():
    return FileResponse("app/templates/index.html")