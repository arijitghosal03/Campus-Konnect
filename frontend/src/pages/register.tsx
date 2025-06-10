import { useState } from "react";

import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import  Modal  from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const RegisterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<"student" | "college" | "company">("student");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//register
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOpen(false);
        alert("Registration successful!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error during registration");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Register</Button>
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Register"
      >
        <form onSubmit={handleSubmit}>
          <Label>
            Role
            <Select value={role} onValueChange={(value) => setRole(value as "student" | "college" | "company")}>
              <option value="student">Student</option>
              <option value="college">College</option>
              <option value="company">Company</option>
            </Select>
          </Label>
          <Label>
            Username
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </Label>
          <Label>
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </Label>
          <Label>
            Password
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </Label>
          <Button type="submit">Register</Button>
        </form>
      </Modal>
    </>
  );
};

export default RegisterModal;
