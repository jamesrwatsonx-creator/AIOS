from TTS.api import TTS
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import io
import wave
import numpy as np
import os

SPEAKER_WAV = "/home/james/.hermes/voice-samples/target/clips/clip-1.wav"
PORT = 8881

tts = TTS(
  model_name="tts_models/multilingual/multi-dataset/your_tts",
  progress_bar=False,
  gpu=False
)

class VoiceHandler(BaseHTTPRequestHandler):
  def do_OPTIONS(self):
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    self.end_headers()

  def do_POST(self):
    if not os.path.exists(SPEAKER_WAV):
      self.send_response(503)
      self.end_headers()
      self.wfile.write(b'Voice sample not found. Place clip-1.wav in clips folder.')
      return

    length = int(self.headers['Content-Length'])
    body = json.loads(self.rfile.read(length))
    text = body.get("text", "")

    if not text.strip():
      self.send_response(400)
      self.end_headers()
      return

    wav = tts.tts(text=text, speaker_wav=SPEAKER_WAV, language="en")

    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
      wf.setnchannels(1)
      wf.setsampwidth(2)
      wf.setframerate(22050)
      wf.writeframes((np.array(wav) * 32767).astype(np.int16).tobytes())

    audio_bytes = buf.getvalue()

    self.send_response(200)
    self.send_header('Content-Type', 'audio/wav')
    self.send_header('Content-Length', str(len(audio_bytes)))
    self.send_header('Access-Control-Allow-Origin', '*')
    self.end_headers()
    self.wfile.write(audio_bytes)

  def log_message(self, format, *args):
    pass

if __name__ == "__main__":
  if not os.path.exists(SPEAKER_WAV):
    print(f"WARNING: No voice sample found.")
    print(f"Place clip-1.wav at: {SPEAKER_WAV}")
  else:
    print("Voice sample found. Ready.")
  server = HTTPServer(('localhost', PORT), VoiceHandler)
  print(f"Hermes voice server on port {PORT}")
  server.serve_forever()
