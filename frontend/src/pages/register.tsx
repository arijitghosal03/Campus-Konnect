import { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff, Shield, Building, GraduationCap, Check, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    rollNo: "",
    staffCode: "",
    companyCode: ""
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  // Simple check for logged-in state (customize as needed)
  const isLoggedIn = typeof window !== "undefined" && (
    localStorage.getItem('college') ||
    localStorage.getItem('student') ||
    localStorage.getItem('company')
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset email verification if email is changed
    if (name === "email" && emailVerified) {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp("");
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (role === "student" && !formData.rollNo) {
      setError("Please enter your roll number");
      return false;
    }

    if (role === "college" && formData.staffCode !== "GCELTSTAFF") {
      setError("Invalid staff code");
      return false;
    }

    if (role === "company" && formData.companyCode !== "GCELTRECRUIT") {
      setError("Invalid company code");
      return false;
    }

    if (!emailVerified) {
      setError("Please verify your email first");
      return false;
    }

    return true;
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp: otp }),
      });

      if (response.ok) {
        setEmailVerified(true);
        setError("");
        alert("Email verified successfully!");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    await sendOtp();
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate password encryption (in real app, this would be done server-side)
      const encryptedPassword = btoa(formData.password); // Simple base64 encoding for demo

      const userData = {
        username: formData.username,
        email: formData.email,
        password: encryptedPassword,
        role: role,
        ...(role === "student" && { rollNo: formData.rollNo }),
        ...(role === "college" && { staffCode: formData.staffCode }),
        ...(role === "company" && { companyCode: formData.companyCode })
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        switch (data.user.role) {
          case 'student':
            router.push('/student');
            break;
          case 'college':
            router.push('/college');
            break;
          case 'company':
            router.push('/company/dashboard');
            break;
          default:
            router.push('/');
            break;
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "student":
        return <GraduationCap size={48} />;
      case "college":
        return <Building size={48} />;
      case "company":
        return <Shield size={48} />;
      default:
        return <User size={48} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

                     <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md m-3 cursor-pointer"
                onClick={() => window.location.href = '/'}
              >
    <img
      src="/logo.svg"
      alt="Campus Konnect Logo"
      className="w-16 h-16 object-contain"
    />
  </div>

  {/* Title styling */}
  <span className="text-2xl font-semibold text-gray-800 tracking-wide">
    <span className="font-bold bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">Campus</span>{' '}
    <span className="font-bold text-gray-900">Konnect</span>
  </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Team</div>
              </Link>
              <Link href="/posts">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Posts</div>
              </Link>
              <Link href="/">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Home</div>
              </Link>
              
              {!isLoggedIn && <Link href="/login">
          <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">
            Login
          </div>
        </Link>}
         {isLoggedIn && <button
          onClick={() => {
            localStorage.removeItem('college');
            localStorage.removeItem('student'); 
            localStorage.removeItem('company');  // Clear login info
            window.location.href="/"
          }}
           className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
        >
          Logout
        </button>}
            </div>

    
          </div>
        </div>
      </nav>
    {/* Background Gradient */}
    <div style={{
      background: "linear-gradient(135deg, rgba(116, 148, 236, 0.1) 0%, rgba(255, 255, 255, 1) 50%, rgba(201, 214, 255, 0.3) 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        width: "900px",
        maxWidth: "90vw",
        minHeight: "650px",
        backgroundColor: "#fff",
        borderRadius: "24px",
        display: "flex",
        boxShadow: "0 25px 50px rgba(116, 148, 236, 0.15)",
        overflow: "hidden"
      }}>
        {/* Left Section */}
        <div style={{
          background: "linear-gradient(135deg, #7494ec 0%, #5c7cfa 100%)",
          width: "45%",
          height: "100%",
          minHeight: "650px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}>
          <div style={{
            textAlign: "center",
            color: "#fff",
            padding: "40px"
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "24px",
              opacity: "0.9"
            }}>
              {getRoleIcon()}
            </div>
            <h2 style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 16px 0",
              lineHeight: "1.2"
            }}>
              Welcome to Our Platform!
            </h2>
            <p style={{
              fontSize: "16px",
              marginBottom: "24px",
              opacity: "0.9",
              lineHeight: "1.5"
            }}>
              Join thousands of users and start your journey with us today
            </p>
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "12px 24px",
              borderRadius: "20px",
              display: "inline-block"
            }}>
              <p style={{
                fontSize: "14px",
                margin: "0",
                textTransform: "capitalize",
                fontWeight: "500"
              }}>
                Registering as {role}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div style={{
          width: "55%",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxHeight: "650px",
          overflowY: "auto"
        }}>
          <h1 style={{
            fontSize: "28px",
            textAlign: "center",
            fontWeight: "700",
            color: "#2d3748",
            marginBottom: "32px"
          }}>
            Create Your Account
          </h1>

          {error && (
            <div style={{
              backgroundColor: "#fed7e2",
              color: "#c53030",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              border: "1px solid #feb2c5"
            }}>
              {error}
            </div>
          )}

          <div>
            {/* Role Selection */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4a5568",
                marginBottom: "8px"
              }}>
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  backgroundColor: "#f7fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "16px",
                  color: "#2d3748",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              >
                <option value="student">Student</option>
                <option value="college">College Staff</option>
                <option value="company">Company</option>
              </select>
            </div>

            {/* Username */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4a5568",
                marginBottom: "8px"
              }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                style={{
                  width: "100%",
                  padding: "14px 50px 14px 20px",
                  backgroundColor: "#f7fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
              <User size={20} style={{
                position: "absolute",
                right: "15px",
                top: "42px",
                color: "#a0aec0"
              }} />
            </div>

            {/* Email with OTP */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4a5568",
                marginBottom: "8px"
              }}>
                Email Address
              </label>
              <div style={{ position: "relative", marginBottom: "12px" }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={emailVerified}
                  style={{
                    width: "100%",
                    padding: "14px 50px 14px 20px",
                    backgroundColor: emailVerified ? "#f0fff4" : "#f7fafc",
                    border: emailVerified ? "2px solid #48bb78" : "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "16px",
                    outline: "none",
                    opacity: emailVerified ? 0.8 : 1,
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => !emailVerified && (e.target.style.borderColor = "#7494ec")}
                  onBlur={(e) => !emailVerified && (e.target.style.borderColor = "#e2e8f0")}
                />
                {emailVerified ? (
                  <Check size={20} style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#48bb78"
                  }} />
                ) : (
                  <Mail size={20} style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#a0aec0"
                  }} />
                )}
              </div>

              {!emailVerified && (
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                  {otpSent && (
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          backgroundColor: "#f7fafc",
                          border: "2px solid #e2e8f0",
                          borderRadius: "8px",
                          fontSize: "16px",
                          outline: "none",
                          textAlign: "center",
                          letterSpacing: "2px",
                          fontWeight: "600"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                      />
                    </div>
                  )}
                  
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpLoading || !formData.email}
                      style={{
                        backgroundColor: "#7494ec",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        cursor: (otpLoading || !formData.email) ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        opacity: (otpLoading || !formData.email) ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minWidth: "120px",
                        justifyContent: "center",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        if (!otpLoading && formData.email) {
                          const target = e.target as HTMLButtonElement;
                          target.style.backgroundColor = "#6366f1";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!otpLoading && formData.email) {
                          const target = e.target as HTMLButtonElement;
                          target.style.backgroundColor = "#7494ec";
                        }
                      }}
                    >
                      <Send size={16} />
                      {otpLoading ? "Sending..." : "Send OTP"}
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={verifyOtp}
                        disabled={otpLoading || !otp || otp.length !== 6}
                        style={{
                          backgroundColor: "#48bb78",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          cursor: (otpLoading || !otp || otp.length !== 6) ? "not-allowed" : "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          opacity: (otpLoading || !otp || otp.length !== 6) ? 0.6 : 1,
                          minWidth: "80px",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => {
                          if (!(otpLoading || !otp || otp.length !== 6)) {
                            const target = e.target as HTMLButtonElement;
                            target.style.backgroundColor = "#38a169";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!(otpLoading || !otp || otp.length !== 6)) {
                            const target = e.target as HTMLButtonElement;
                            target.style.backgroundColor = "#48bb78";
                          }
                        }}
                      >
                        {otpLoading ? "..." : "Verify"}
                      </button>
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={otpLoading}
                        style={{
                          backgroundColor: "transparent",
                          color: "#7494ec",
                          border: "2px solid #7494ec",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          cursor: otpLoading ? "not-allowed" : "pointer",
                          fontSize: "12px",
                          fontWeight: "600",
                          opacity: otpLoading ? 0.6 : 1,
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => {
                          if (!otpLoading) {
                            const target = e.target as HTMLButtonElement;
                            target.style.backgroundColor = "#7494ec";
                            target.style.color = "#fff";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!otpLoading) {
                            const target = e.target as HTMLButtonElement;
                            target.style.backgroundColor = "transparent";
                            target.style.color = "#7494ec";
                          }
                        }}
                      >
                        Resend
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Role-specific fields */}
            {role === "student" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a5568",
                  marginBottom: "8px"
                }}>
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  placeholder="Enter your roll number"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    backgroundColor: "#f7fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            )}

            {role === "college" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a5568",
                  marginBottom: "8px"
                }}>
                  Staff Code
                </label>
                <input
                  type="text"
                  name="staffCode"
                  value={formData.staffCode}
                  onChange={handleInputChange}
                  placeholder="Enter staff code (GCELTSTAFF)"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    backgroundColor: "#f7fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            )}

            {role === "company" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a5568",
                  marginBottom: "8px"
                }}>
                  Company Code
                </label>
                <input
                  type="text"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleInputChange}
                  placeholder="Enter company code (GCELTRECRUIT)"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    backgroundColor: "#f7fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            )}

            {/* Password */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4a5568",
                marginBottom: "8px"
              }}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  padding: "14px 50px 14px 20px",
                  backgroundColor: "#f7fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "42px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#a0aec0"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ position: "relative", marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4a5568",
                marginBottom: "8px"
              }}>
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                style={{
                  width: "100%",
                  padding: "14px 50px 14px 20px",
                  backgroundColor: "#f7fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#7494ec"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "42px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#a0aec0"
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !emailVerified}
              style={{
                backgroundColor: emailVerified ? "#7494ec" : "#cbd5e0",
                width: "100%",
                height: "52px",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                cursor: (loading || !emailVerified) ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                opacity: (loading || !emailVerified) ? 0.7 : 1,
                transition: "all 0.2s",
                letterSpacing: "0.5px"
              }}
              onMouseOver={(e) => emailVerified && !loading && ((e.target as HTMLButtonElement).style.backgroundColor = "#6366f1")}
              onMouseOut={(e) => emailVerified && !loading && ((e.target as HTMLButtonElement).style.backgroundColor = "#7494ec")}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {!emailVerified && (
              <p style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#a0aec0",
                marginTop: "12px"
              }}>
                Please verify your email before creating account
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignUpPage;