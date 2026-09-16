from app.core.config import get_settings
from app.services.llm_service import LLMService
from app.services.text_merge_service import TextMergeService
from app.services.grammar_fix_service import GrammarFixService
from app.services.translator_service import TranslatorService
from app.services.summarizer_service import SummarizerService
from app.services.dictionary_service import DictionaryService

def get_dictionary_service() -> DictionaryService:
    llm_service = LLMService(get_settings())
    return DictionaryService(llm_service)
    
def get_grammar_fix_service() -> GrammarFixService:
    llm_service = LLMService(get_settings())
    return GrammarFixService(llm_service)

def get_summarizer_service() -> SummarizerService:
    llm_service = LLMService(get_settings())
    return SummarizerService(llm_service)

def get_text_merge_service() -> TextMergeService:
    llm_service = LLMService(get_settings())
    return TextMergeService(llm_service)

def get_translator_service() -> TranslatorService:
    llm_service = LLMService(get_settings())
    return TranslatorService(llm_service)


