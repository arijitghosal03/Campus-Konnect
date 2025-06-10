global.otpStore = global.otpStore || new Map();
const otpStore = global.otpStore;
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ message: 'OTP not found or expired' });
  }

  if (Date.now() > storedData.expires) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP verified successfully
  otpStore.delete(email);
  res.status(200).json({ message: 'OTP verified successfully' });
}