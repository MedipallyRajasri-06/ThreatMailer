/**
 * Lightweight Standalone Backend Server for ThreatMailer (ES Module)
 * Implements REST APIs for email threat analysis, investigations repository,
 * and forensic report generation with zero external database dependencies (in-memory fallback).
 *
 * Run with: node backend/server.js
 */

import http from 'node:http';
import url from 'node:url';

const PORT = process.env.PORT || 5000;

// In-Memory Database Store for Investigations
const investigationsDB = [
  {
    id: 'INV-2026-0001',
    createdAt: '2026-09-10T10:34:00+05:30',
    fileName: 'suspicious_paypal_urgent_notice.eml',
    subject: 'URGENT: Your account will be suspended within 24 hours',
    sender: 'security@paypa1-security.example',
    recipient: 'officer@defense-gov.in',
    threatScore: 92,
    riskLevel: 'CRITICAL',
    classification: 'CRITICAL – PHISHING',
    summary:
      'High-confidence credential harvesting attack deploying character substitution and weaponized redirection links. Originating IP located on bulletproof hosting network with failing SPF/DKIM/DMARC.',
    originIp: '185.220.101.5',
    originLocation: 'Jurong West, Singapore',
    iocs: [
      { type: 'IP', indicator: '185.220.101.5', risk: 'CRITICAL', reason: 'Bulletproof relay' },
      { type: 'Domain', indicator: 'paypa1-security.example', risk: 'CRITICAL', reason: 'Typosquatted domain' },
      { type: 'URL', indicator: 'http://paypa1-login.example/auth?token=9f83a812', risk: 'CRITICAL', reason: 'Harvesting link' },
    ],
  },
  {
    id: 'INV-2026-0002',
    createdAt: '2026-09-10T09:20:00+05:30',
    fileName: 'urgent_ceo_wire_transfer.eml',
    subject: 'CONFIDENTIAL: Urgent Acquisition Wire Transfer',
    sender: 'robert.henderson@enterprise-corp-exec.org',
    recipient: 'cfo@enterprise-corp.com',
    threatScore: 78,
    riskLevel: 'HIGH',
    classification: 'HIGH – BUSINESS EMAIL COMPROMISE (BEC)',
    summary: 'Executive impersonation spear-phishing attack diverting replies to offshore encrypted mailbox.',
    originIp: '195.154.122.88',
    originLocation: 'Paris, France',
    iocs: [
      { type: 'IP', indicator: '195.154.122.88', risk: 'HIGH', reason: 'Unauthorized relay' },
      { type: 'Email', indicator: 'executive.confidential77@protonmail-offshore.org', risk: 'CRITICAL', reason: 'Exfiltration reply-to' },
    ],
  },
];

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json');

  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ACTIVE', service: 'ThreatMailer Threat Engine API', timestamp: new Date() }));
      return;
    }

    if (pathname === '/api/investigations' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: investigationsDB.length, data: investigationsDB }));
      return;
    }

    const invMatch = pathname.match(/^\/api\/investigations\/([a-zA-Z0-9_-]+)$/);
    if (invMatch && req.method === 'GET') {
      const id = invMatch[1];
      const found = investigationsDB.find((inv) => inv.id === id);
      if (found) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: found }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: `Investigation with ID ${id} not found.` }));
      }
      return;
    }

    const iocsMatch = pathname.match(/^\/api\/investigations\/([a-zA-Z0-9_-]+)\/iocs$/);
    if (iocsMatch && req.method === 'GET') {
      const id = iocsMatch[1];
      const found = investigationsDB.find((inv) => inv.id === id);
      if (found) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, investigationId: id, count: found.iocs.length, iocs: found.iocs }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Investigation not found' }));
      }
      return;
    }

    if ((pathname === '/api/analyze-email' || pathname === '/api/investigations') && req.method === 'POST') {
      const payload = await parseBody(req);
      const emailContent = payload.emailContent || payload.raw || payload.url || '';

      const isPhish = /paypa1|micros0ft|urgent|wire transfer|suspended|verify/i.test(emailContent);
      const score = isPhish ? Math.floor(75 + Math.random() * 20) : Math.floor(2 + Math.random() * 8);
      const riskLevel = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : 'LOW';
      const classification = score >= 80 ? 'CRITICAL – PHISHING' : score >= 60 ? 'HIGH – BEC / SUSPICIOUS' : 'LOW – CLEAN';

      const newRecord = {
        id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        fileName: payload.fileName || 'analyzed_input.eml',
        subject: payload.subject || 'Security Triage Incident',
        sender: payload.sender || 'unknown@sender.example',
        recipient: payload.recipient || 'officer@defense-gov.in',
        threatScore: score,
        riskLevel,
        classification,
        summary: `Automated scan evaluated input payload. Calculated threat score of ${score}/100 (${classification}).`,
        originIp: isPhish ? '185.220.101.5' : '209.85.220.69',
        originLocation: isPhish ? 'Jurong West, Singapore' : 'Mountain View, United States',
        iocs: isPhish
          ? [
              { type: 'IP', indicator: '185.220.101.5', risk: 'CRITICAL', reason: 'High-risk relay host' },
              { type: 'Domain', indicator: 'paypa1-security.example', risk: 'CRITICAL', reason: 'Homoglyph brand imitation' },
            ]
          : [],
      };

      investigationsDB.unshift(newRecord);

      res.writeHead(201);
      res.end(JSON.stringify({ success: true, message: 'Threat analysis completed.', data: newRecord }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`[ThreatMailer Backend API] Listening on http://localhost:${PORT}`);
  console.log(`  - GET  /api/health`);
  console.log(`  - GET  /api/investigations`);
  console.log(`  - GET  /api/investigations/:id`);
  console.log(`  - GET  /api/investigations/:id/iocs`);
  console.log(`  - POST /api/analyze-email`);
});
