set agws_doc_path=%cd%\doc
@echo %agws_doc_path%
@RD /S /Q "%agws_doc_path%"
jsdoc agws.js --destination ./doc/
