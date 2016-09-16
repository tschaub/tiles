.DELETE_ON_ERROR:

DATA_DIR := ./data
BLUE_MARBLE_URL := http://neo.sci.gsfc.nasa.gov/servlet/RenderData?si=526311&cs=rgb&format=TIFF&width=3600&height=1800
BLUE_MARBLE := $(DATA_DIR)/blue-marble.tif


.PHONY: all
all: $(BLUE_MARBLE)


$(BLUE_MARBLE):
	@mkdir -p `dirname $@`
	curl '$(BLUE_MARBLE_URL)' --output $@
