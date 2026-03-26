"use client";

import { useState } from "react";
import { useConfigStore } from "@/lib/store/useConfigStore";
import { Switch } from "@/components/ui/switch";
import { Database, TestTube, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MockToggle() {
  const { isMockMode, toggleMockMode } = useConfigStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = () => {
    if (!isMockMode) {
      setShowConfirm(true);
    } else {
      toggleMockMode();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-20 left-4 z-40 lg:bottom-4">
        <div className="flex items-center gap-3 glass px-4 py-3 rounded-xl shadow-lg border-2">
          <div className="flex items-center gap-2">
            {isMockMode ? (
              <TestTube className="w-5 h-5 text-lavender-600" />
            ) : (
              <Database className="w-5 h-5 text-mint-600" />
            )}
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {isMockMode ? "Mock Data" : "Live API"}
              </div>
              <div className="text-xs text-gray-500">
                {isMockMode ? "Demo mode active" : "Connected to backend"}
              </div>
            </div>
          </div>

          <Switch
            checked={!isMockMode}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-mint-500"
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-mint-600" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirm(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Switch to Live API?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This will connect to your backend server at{" "}
              <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">
                localhost:8000
              </code>
              . Make sure your FastAPI server is running.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toggleMockMode();
                  setShowConfirm(false);
                }}
                className="flex-1 bg-mint-500 hover:bg-mint-600"
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
