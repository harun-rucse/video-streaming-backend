class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.status = statusCode < 400 ? "success" : "error";
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
