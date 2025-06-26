def check_response_status(response):
    """Check HTTP response status and raise exception if error occurred"""
    if response.status_code >= 400:
        raise Exception(f"HTTP {response.status_code} error")
    return response
