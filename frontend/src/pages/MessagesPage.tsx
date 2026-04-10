import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, messagesAPI } from '@/lib/dashboard-api';
import { AlertCircle, Send, Trash2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useSuccessToast } from '@/hooks/useErrorHandler';
import { formatDistanceToNow, format } from 'date-fns';
import { MessagesLoadingState } from '@/components/skeleton-loaders';

export default function MessagesPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleError } = useErrorHandler();
  const { showSuccess } = useSuccessToast();

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data.data || []);
        if (data.data && data.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data.data[0]._id);
        }
      } catch (err) {
        handleError(err, { title: 'Failed to load projects' });
      }
    };

    loadProjects();
  }, [handleError]);

  // Load messages when selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await messagesAPI.getForProject(selectedProjectId);
        setMessages(data.data || []);
        setError(null);
      } catch (err) {
        const message = handleError(err, { title: 'Failed to load messages' });
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [selectedProjectId, handleError]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedProjectId) return;

    setSending(true);
    try {
      const newMessage = await messagesAPI.send(selectedProjectId, messageText);
      setMessages([...messages, newMessage.data]);
      setMessageText('');
      showSuccess('Message sent');
    } catch (err) {
      handleError(err, { title: 'Failed to send message' });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await messagesAPI.delete(messageId);
      setMessages(messages.filter((m) => m._id !== messageId));
      showSuccess('Message deleted');
    } catch (err) {
      handleError(err, { title: 'Failed to delete message' });
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Project Messages</h1>
        <p className="text-slate-600 mt-1">Communicate with your team about project updates</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <h3 className="font-semibold text-red-900">Error loading messages</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Project List */}
        <div className="col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <MessageCircle size={18} />
              Projects
            </h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {projects.length === 0 ? (
              <div className="p-4 text-center text-slate-600 text-sm">No projects found</div>
            ) : (
              projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => setSelectedProjectId(project._id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-all ${
                    selectedProjectId === project._id
                      ? 'bg-indigo-50 border-l-4 border-l-indigo-600'
                      : ''
                  }`}
                >
                  <p className="font-medium text-slate-900 truncate">{project.title}</p>
                  <p className="text-xs text-slate-600 truncate">{project.status}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-3 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
          {!selectedProjectId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600 font-medium">Select a project to view messages</p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center w-full">
                <MessagesLoadingState />
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-600">
                    <MessageCircle size={32} className="mx-auto text-slate-300 mb-2" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderId === user?._id ? 'justify-end' : 'justify-start'
                        } mb-2`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg group transition-all ${
                            message.senderId === user?._id
                              ? 'bg-indigo-600 text-white shadow-sm hover:shadow-md'
                              : 'bg-slate-100 text-slate-900 shadow-sm hover:shadow-md hover:bg-slate-150'
                          }`}
                        >
                          {message.senderId !== user?._id && (
                            <p className="text-xs font-semibold mb-1 opacity-75">
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm break-words">{message.text}</p>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <p
                              className={`text-xs ${
                                message.senderId === user?._id
                                  ? 'text-indigo-100'
                                  : 'text-slate-500'
                              }`}
                              title={format(new Date(message.createdAt), 'PPpp')}
                            >
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                            {message.senderId === user?._id && (
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete message"
                              >
                                <Trash2 size={14} className="text-indigo-200 hover:text-red-300" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-200 p-4 bg-slate-50"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-all flex items-center space-x-2"
                  >
                    <span className={sending ? 'opacity-50' : ''}>
                      <Send size={18} />
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
