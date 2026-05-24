export function healthCheck(_req, res) {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'file-tools-api',
  });
}

