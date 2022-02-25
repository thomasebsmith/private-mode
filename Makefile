INFO_FILES = README.md LICENSE
SRC_DIR = src
EXCLUDE = .DS_Store

EXT_BUNDLE = privateMode.zip
EXT_BUNDLE_ABSOLUTE = ${CURDIR}/${EXT_BUNDLE}

${EXT_BUNDLE}:
	zip $@ ${INFO_FILES}
	cd ${SRC_DIR} && zip -u -r ${EXT_BUNDLE_ABSOLUTE} * --exclude ${EXCLUDE}

clean:
	rm -f ${EXT_BUNDLE}
