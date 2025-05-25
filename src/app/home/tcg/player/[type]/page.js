"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TCGPlayerPage() {
  const { type } = useParams();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [referrer, setReferrer] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type !== "register" && type !== "update") {
      alert("非法操作类型！");
      router.push("/home/tcg/player/register");
    }
  }, [type, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword || password !== confirmPassword) {
      alert("请填写完整并确认密码一致");
      return;
    }

    setLoading(true);
    setResponse(null);

    const payload =
      type === "register"
        ? {
            method: "register",
            username,
            password,
            mobile,
            invitationCode,
            referrer,
            currency: "CNY",
          }
        : {
            method: "update",
            username,
            password,
          };

    try {
      const res = await fetch("/api/tcg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "请求失败，请稍后再试。" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1626] to-[#24344d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          {type === "register" ? "Register" : "Update Password"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Please enter username"
            required
            minLength={4}
            maxLength={14}
            pattern="[a-z0-9]+"
            className="w-full px-4 py-2 border rounded-md focus:ring outline-none"
          />

          {type === "register" && (
            <>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile (optional)"
                className="w-full px-4 py-2 border rounded-md focus:ring outline-none"
              />
              <input
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                placeholder="Invitation Code (optional)"
                className="w-full px-4 py-2 border rounded-md focus:ring outline-none"
              />
              <input
                type="text"
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
                placeholder="Referrer (optional)"
                className="w-full px-4 py-2 border rounded-md focus:ring outline-none"
              />
            </>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              minLength={6}
              maxLength={12}
              pattern="[A-Za-z0-9]+"
              className="w-full px-4 py-2 border rounded-md focus:ring outline-none pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              minLength={6}
              maxLength={12}
              pattern="[A-Za-z0-9]+"
              className="w-full px-4 py-2 border rounded-md focus:ring outline-none pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              👁️
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            {loading
              ? "Processing..."
              : type === "register"
              ? "Register"
              : "Update Password"}
          </button>
        </form>

        {type === "register" && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? Please login.
          </p>
        )}

        {response && (
          <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
