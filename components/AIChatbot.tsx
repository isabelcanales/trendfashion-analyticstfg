"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle ESC key to close and prevent body scroll
  useEffect(() => {
    if (!isOpen) {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar el mensaje");
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);

      // Add error message to chat
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ ${errorMessage}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#8a2638] shadow-lg transition hover:bg-[#a83450] hover:shadow-xl active:scale-95"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/20 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-40 flex flex-col bg-[#fffaf7] shadow-2xl md:w-[420px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-[#eadbd4] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#151111]">
                      Asistente IA
                    </h2>
                    <p className="mt-1 text-xs text-[#6d6260]">
                      TrendFashion Analytics
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Cerrar asistente IA"
                    title="Cerrar (ESC)"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8a2638] text-white transition hover:bg-[#a83450] active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <MessageCircle size={48} className="mx-auto mb-4 text-[#c8a96a]/30" />
                      <p className="text-sm font-semibold text-[#151111]">
                        ¡Hola! Soy tu asistente IA
                      </p>
                      <p className="mt-2 text-xs text-[#6d6260]">
                        Pregúntame sobre tendencias, marcas, noticias y más.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-[#8a2638] text-white"
                              : "border border-[#eadbd4] bg-white text-[#151111]"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => <h1 className="text-base font-bold mt-2 mb-1">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-sm font-bold mt-2 mb-1">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-semibold mt-1.5 mb-0.5">{children}</h3>,
                                p: ({ children }) => <p className="mb-2">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                code: ({ children, inline }: any) =>
                                  inline ? (
                                    <code className="bg-[#f0f0f0] px-1.5 py-0.5 rounded text-xs font-mono text-[#8a2638]">{children}</code>
                                  ) : (
                                    <code className="block bg-[#f0f0f0] p-2 rounded text-xs font-mono overflow-auto mb-2">{children}</code>
                                  ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="rounded-2xl border border-[#eadbd4] bg-white px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <Loader size={16} className="animate-spin text-[#8a2638]" />
                            <span className="text-xs text-[#6d6260]">
                              Pensando...
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-6 rounded-[8px] border-l-4 border-l-red-500 bg-red-50 px-4 py-3 text-xs text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {/* Input Area */}
              <div className="border-t border-[#eadbd4] px-6 py-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta..."
                    disabled={isLoading}
                    className="flex-1 rounded-[8px] border border-[#eadbd4] bg-white px-4 py-2.5 text-sm placeholder-[#6d6260] outline-none transition focus:border-[#8a2638] focus:ring-1 focus:ring-[#8a2638]/20 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Enviar mensaje"
                    className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#8a2638] transition hover:bg-[#a83450] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    <Send size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Footer - Close Button */}
              <div className="border-t border-[#eadbd4] bg-[#fffaf7] px-6 py-4">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar asistente IA"
                  className="w-full rounded-[8px] bg-[#8a2638] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.05em] text-white transition hover:bg-[#a83450] active:scale-95"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
