# custom_poa_middleware.py

def _poa_middleware(make_request, web3):
    def middleware(method, params):
        response = make_request(method, params)
        if method in ("eth_getBlockByNumber", "eth_getBlockByHash"):
            if "result" in response and response["result"] is not None:
                block = response["result"]
                extra_data = block.get("extraData")
                if extra_data and len(extra_data) > 66:  # '0x' + 64 hex characters
                    block["extraData"] = "0x00"
        return response
    return middleware


# custom_poa_middleware.py


class GethPOAMiddleware:
    def __init__(self, web3):
        self.web3 = web3

    def wrap_make_request(self, make_request):
        """
        Called by Web3 to wrap the existing request logic with custom logic.
        """
        def middleware(method, params):
            response = make_request(method, params)
            # Patch 'extraData' if needed
            if method in ("eth_getBlockByNumber", "eth_getBlockByHash"):
                block = response.get("result")
                if block and "extraData" in block:
                    extra_data = block["extraData"]
                    # Convert extra_data to hex if it's a HexBytes object
                    if hasattr(extra_data, "hex"):
                        extra_data_hex = extra_data.hex()
                    else:
                        extra_data_hex = extra_data

                    # Compute the byte length (strip "0x" if present)
                    if extra_data_hex.startswith("0x"):
                        byte_length = (len(extra_data_hex) - 2) // 2
                    else:
                        byte_length = len(extra_data_hex) // 2

                    # If extraData is longer than 32 bytes, truncate it to avoid POA error
                    if byte_length > 32:
                        block["extraData"] = "0x00"

            return response

        return middleware
