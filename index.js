const express = require('express');
const EfiPay = require('sdk-node-apis-efi');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const certContent = `-----BEGIN CERTIFICATE-----
MIIEVDCCAjygAwIBAgIQIg58FjmgZYfuuF/u2EaOPDANBgkqhkiG9w0BAQsFADCB
rTELMAkGA1UEBhMCQlIxFTATBgNVBAgMDE1pbmFzIEdlcmFpczEsMCoGA1UECgwj
RWZpIFMuQS4gLSBJbnN0aXR1aWNhbyBkZSBQYWdhbWVudG8xFzAVBgNVBAsMDklu
ZnJhZXN0cnV0dXJhMRswGQYDVQQDDBJhcGlzLmVmaXBheS5jb20uYnIxIzAhBgkq
hkiG9w0BCQEWFGluZnJhQHNlamFlZmkuY29tLmJyMB4XDTI2MDYwODE4MTEyM1oX
DTI5MDYwODE4MTEyM1owHjEPMA0GA1UEAxMGOTIwMDc3MQswCQYDVQQGEwJCUjCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANzA9wVNBHP+ZUa6Yg/fsgCJ
3ed6NhS2EoX9PTIHR1vh7v/Zvht3W8TO1+iojwS3SDMZhXers6XpwefI4UENo+DY
V1E6m8bpYvOnqIjy4xMZRNPl5wMzKRM5S3npuPmQhN8z+I95c9IPvHynKmzCjQGy
jVO7ZvlZzkgYwtzLZjEt/rSi5FlKPHaQI+rMLfxxtDQiZ7SkkNYbHcj+vmHcMtFq
L1DSnTbyRbgZ4V7mveFPQje0IChGi6U28hYied/T1Q18r27HASdgsleVzG5RHwYp
4Tr7YgmMl5QB8BDyt3rqkR4NSScMI1/XJylyXJTOLLBioRh+OMvniGmHfSV5RWcC
AwEAATANBgkqhkiG9w0BAQsFAAOCAgEAhjSVzk0EWvmddGVZyuHQGHGum7vCeRtR
Nrh2MlDzWJAbifqJ1e1/hGgox2WybXpwdsqFTTWCCeq4iSLfIEJOg1R4NbiqOcAv
OdBWB0I8B3GXzDIMm5sbU9rpggcmbdNv2dfFr4EjmBmhr8vbgrMdcJ+ajhazuHw1
y/fi0XL82y084Y4wwTTg30ZB74jJlSViYK0zMm56EqC/FFB/jKjzMWEVNGvu2VBb
8wx2FZX+7IE5veqZr4jUEdaIWXGNP1s7My+wHYQ0ijmh7Zng+DhMsgMRR8QZWYoL
k1a4g3GlbeGv2VJraSbrZnHUyGewTFp4Q0PtjUFR168WoMGSFsyJ2CZLk0iCzUCK
zKVCz6Prbpn2RP8x14HisUleJXD0iuq9VQKJFybeNbHncVF4Rbd/4gcOQYfLVFoF
nqLyS5oHgdd90+efL5abbr98knn2niJqd1OrJ97Wz/U7vlysYcNUGHCfcJ2J2BWy
xf//u/HxwqRRqaxqnr5To0oatrbq3TYGiCFujbjlQ022sRhy29yJaijFSZFqGLtG
clB4lFoPyeTl4u/fpWxDIkXm5kMpTNj3l4a6/yAyUlDDn+Akuri1Uohr2EZBrtTD
QIz1xzZPjK4IURBMBKIsFUH7Yh3xZD2vgiktBgMqG6q9g/JhE+oFAwQRCi9V+tib
xnSBoNDdf98=
-----END CERTIFICATE-----
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDcwPcFTQRz/mVG
umIP37IAid3nejYUthKF/T0yB0db4e7/2b4bd1vEztfoqI8Et0gzGYV3q7Ol6cHn
yOFBDaPg2FdROpvG6WLzp6iI8uMTGUTT5ecDMykTOUt56bj5kITfM/iPeXPSD7x8
pypswo0Bso1Tu2b5Wc5IGMLcy2YxLf60ouRZSjx2kCPqzC38cbQ0Ime0pJDWGx3I
/r5h3DLRai9Q0p028kW4GeFe5r3hT0I3tCAoRoulNvIWInnf09UNfK9uxwEnYLJX
lcxuUR8GKeE6+2IJjJeUAfAQ8rd66pEeDUknDCNf1ycpclyUziywYqEYfjjL54hp
h30leUVnAgMBAAECggEBAIRoZYHTcUFVrE9hCeJ1jSHPj78AyaFgl/mwLF1uijmt
aZoic2msDOoeGtjdCXONr4ue2jQuU8HHVNv+3EUVtl7txGnfWoJTiFuXC3qhHNxe
wq7Kbea4cAGs0v2b16wxJ9FtLcB426R6ddbauZKkmskS3LwFYr1bRWRvHaorge8q
hwbEPNxYMLLeGqtFBVquYi3NV9P3BJQAs7W17s/v7pQFIddEpM51N67Kg+jpF2Ec
S1ebHTfuCl11msbiT0bdfP8J8l8WeMBkpcAAe43N9wic4nn/1+MYXGbsoRgtOHEq
21PQzqknDtLqWuz5x77C86Vllh6v0qdSZj4/9SgmyOkCgYEA9ol5rpMSSdWPmY3Z
vnsed9n7dBUQ9U2eekk4kmdn6uXnjvUGSId4fkUUM2VG6ZK7oMRramKq6J8vW9XV
GSBtXc3hucxeGXmY9ZbJ0hyGP7z6Pt81Ru/qRHxTMDb4GejwPvikJLZtb9C3YgCI
2RT7N4gYl3fuGZ3EY9/tMwD8KKsCgYEA5TojVOnNctIWj/EdcKjqllWOtGrg3/dm
RSSt9h7rXX8G4HBjNkV6YJjndP6S5m4PbIRxBgnJIZjpr7zpdJ29GJX2I24b4Etm
VdubdL8F97yP5sXpnN5ht6F0VQc0zPqNvBSliu8YNjuN8yEhsugkr9lbLNapp7UY
dWLRxgQijjUCgYADuWPrLTGTh/RZX3kwlW+KY/KWeFL/QaLpOf3uyD0boUl0MWNc
6R762VRKynbdxGetMApnWwI17WGrw3kqngDI7/k+80VgoSOcYiC+Wcv1XodxN7H4
Vlt1mWMwUURCL/ChIuRn4ZGZpM+AXX2zuctptVaZwygHnwh+cb2FjbhBbQKBgQCe
7ktW8XAX3x/zlyphVUypBRMXdk8KGh9Xa1IOJmvr/EnJTUMMeumZlgpMrMEvcTnS
dJVkqV5BpCLKTQHUcBWOuVLaR9qeDckbWFMVg+hgVuWzDJ+nuuwnhJMC7Scnw8SH
lg0dIh84YtxNqTgTMi9VmS9FDGS+uaoGoYhucal/zQKBgCYoD6qhUIqXcWujUYn5
q0f81Mhc0G91vxPIuIQmxCvOz+MP4weIu+jYr5hnXVda55wF4kVA4L3E0Vg75SCV
JQGOyVMg2Y5AB4u9Aq8u6iTq6WXEPFrKaZTM7QGjtNz6k1KnnL/sgtTMOD8CebVN
fEt14PV6vOMN8OOVR08BOe1B
-----END PRIVATE KEY-----`;

const certPath = path.join('/tmp', 'certificado.pem');
fs.writeFileSync(certPath, certContent);

const options = {
  sandbox: false,
  client_id: 'Client_Id_b9466991b20e6a589caa32ebee040b3bd42b4c8e',
  client_secret: 'Client_Secret_ce169552995bdaaf1b19b9b7ea9acd408256ca4e',
  certificate: certPath,
  pemKey: certPath,
  certificate_type: 'pem'
};

app.post('/criar-pix', async (req, res) => {
  try {
    const { valor, chavePix } = req.body;
    const efipay = new EfiPay(options);
    const body = {
      calendario: { expiracao: 900 },
      valor: { original: valor },
      chave: chavePix,
      solicitacaoPagador: "Promovox - Propaganda"
    };
    const cobranca = await efipay.pixCreateImmediateCharge({}, body);
    const qrcode = await efipay.pixGenerateQRCode({ id: cobranca.loc.id });
    res.json({
      txid: cobranca.txid,
      pixCopiaECola: qrcode.qrcode,
      linkPagamento: 'https://' + cobranca.location,
      imagemQrcode: qrcode.imagemQrcode,
      status: cobranca.status
    });
  } catch (error) {
    console.error('ERRO CRIAR PIX:', error.message, JSON.stringify(error));
    res.status(500).json({ error: error.message });
  }
});

app.post('/registrar-webhook', async (req, res) => {
  try {
    const efipay = new EfiPay(options);
    const params = { chave: 'b64c383a-b3e6-4ff3-b58f-ac23c5b72390' };
    const body = { webhookUrl: 'https://promovox-pix.onrender.com/webhook-pix?ignorar=' };
    const resultado = await efipay.pixConfigWebhook(params, body);
    res.json({ sucesso: true, resultado });
  } catch (error) {
    console.error('ERRO WEBHOOK:', error.message, JSON.stringify(error));
    res.status(500).json({ error: error.message });
  }
});

app.post('/webhook-pix', async (req, res) => {
  try {
    console.log('Webhook recebido:', JSON.stringify(req.body));
    const { pix } = req.body;
    if (pix && pix.length > 0) {
      for (const pagamento of pix) {
        console.log('PIX pago:', pagamento.txid, pagamento.valor);
      }
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(200).json({ ok: true });
  }
});

app.get('/webhook-pix', (req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Promovox PIX rodando na porta ${PORT}`));
