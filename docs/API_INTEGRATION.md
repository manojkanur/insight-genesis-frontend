# WhitePaper AI - API Integration Documentation

## Overview
This document outlines how to integrate the React frontend with the Flask backend API.

## Environment Setup

1. **Create Environment File**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure API URL**:
   ```env
   # For local development
   VITE_API_BASE_URL=http://127.0.0.1:5000
   
   # For production
   VITE_API_BASE_URL=https://api.mywhitepaper.ai
   ```

## Backend CORS Configuration

Your Flask backend needs to handle CORS for cross-origin requests. Add this to your Flask app:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "https://app.mywhitepaper.ai"  # Production frontend
])

# Or configure specific CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
```

## API Endpoints Expected

The frontend expects these Flask endpoints:

### 1. Health Check (Optional)
```python
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    })
```

### 2. File Upload
```python
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    # Process file...
    
    return jsonify({
        'filename': file.filename,
        'path': '/path/to/uploaded/file',
        'message': 'File uploaded successfully'
    })
```

### 3. Generate Whitepaper
```python
@app.route('/api/generate', methods=['POST'])
def generate_whitepaper():
    data = request.get_json()
    
    # Required fields
    title = data.get('title')
    industry = data.get('industry')
    audience = data.get('audience')
    problem_statement = data.get('problem_statement')
    solution_outline = data.get('solution_outline')
    
    # Optional fields
    tone = data.get('tone', 'Professional')
    length = data.get('length', 'Medium (10-20 pages)')
    
    # Generate whitepaper...
    
    return jsonify({
        'pdf_path': '/path/to/generated/whitepaper.pdf',
        'sections': ['Introduction', 'Problem Analysis', 'Solution', 'Conclusion']
    })
```

### 4. Chat with Documents
```python
@app.route('/api/chat', methods=['POST'])
def chat_with_document():
    data = request.get_json()
    
    question = data.get('question')
    doc_path = data.get('doc_path')
    
    # Process question against document...
    
    return jsonify({
        'question': question,
        'answer': 'AI generated response...',
        'context_used': 'Relevant document excerpt...'
    })
```

### 5. File Download
```python
@app.route('/api/download/<path:filename>', methods=['GET'])
def download_file(filename):
    try:
        return send_file(filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
```

## Error Handling

The frontend expects consistent error responses:

```python
# Standard error response format
def error_response(message, status_code=400):
    return jsonify({
        'error': message,
        'status_code': status_code
    }), status_code

# Usage in endpoints
if not title:
    return error_response('Title is required', 400)
```

## File Upload Handling

For file uploads, ensure your Flask app can handle multipart/form-data:

```python
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return error_response('No file provided')
    
    file = request.files['file']
    
    if file.filename == '':
        return error_response('No file selected')
    
    if not allowed_file(file.filename):
        return error_response('File type not allowed. Please upload PDF or DOCX files.')
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        return jsonify({
            'filename': filename,
            'path': file_path,
            'message': 'File uploaded successfully'
        })
```

## Testing API Integration

1. **Start your Flask backend**: `python run.py`
2. **Start the React frontend**: `npm run dev`
3. **Test file upload**: Upload a PDF/DOCX file
4. **Test whitepaper generation**: Fill out the generation form
5. **Test chat**: Ask questions about uploaded documents

## Production Deployment

For production:

1. **Update environment variables**:
   ```env
   VITE_API_BASE_URL=https://api.mywhitepaper.ai
   ```

2. **Build the frontend**:
   ```bash
   npm run build
   ```

3. **Configure CORS** for your production domain

4. **Set up HTTPS** for both frontend and backend

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure CORS is properly configured on your Flask backend
2. **Network Errors**: Check that the API URL is correct and the backend is running
3. **File Upload Issues**: Verify file size limits and allowed file types
4. **Loading States**: The frontend shows loading indicators during API calls

### Debug Mode:

The frontend logs all API requests and responses to the browser console when in development mode.

## API Functions Available

The frontend provides these ready-to-use API functions:

- `uploadFile(file)` - Upload a file
- `generateWhitepaper(data)` - Generate a whitepaper
- `chatWithWhitepaper(question, docPath)` - Chat with documents
- `downloadFile(filePath)` - Download generated files
- `getHealthStatus()` - Check API health

These are all available in `src/lib/api.ts` and can be used in any component.