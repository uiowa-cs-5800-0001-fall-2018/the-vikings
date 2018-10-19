"""
Placeholder function to get pen XML content by id
"""
def get_pen(pen_id):
	if pen_id==1:
		xml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text_print" id="oN0%3l0rDEA(sHj1@Dkz" x="203" y="202"></block></xml>'
	else:
		xml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="controls_if" id="lKrTH@hb`XF|)HV)M$6]" x="178" y="124"><mutation else="1"></mutation></block></xml>'

	return {"status": "success", "content": xml}

