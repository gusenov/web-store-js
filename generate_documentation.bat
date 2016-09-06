set agws_docs_path=%cd%\docs
@echo %agws_docs_path%
@RD /S /Q "%agws_docs_path%"
jsdoc agws.js --destination ./docs/
