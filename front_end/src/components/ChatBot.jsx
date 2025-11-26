import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { loansData } from '../data/loansData';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          text: 'Xin chào! Tôi là trợ lý AI của GreenFund. Tôi có thể giúp bạn tìm kiếm gói vay phù hợp nhất với nhu cầu đầu tư xanh của bạn. Hãy cho tôi biết bạn đang quan tâm đến lĩnh vực nào hoặc loại dự án nào bạn muốn đầu tư? 🌱',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  // Call Gemini API
  const callGeminiAPI = async (userMessage) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_MODEL = 'gemini-flash-lite-latest'; 
    
    if (!GEMINI_API_KEY) {
      throw new Error('API key chưa được cấu hình');
    }

    // Prepare loans data for prompt
    const loansInfo = loansData.map(loan => ({
      id: loan.id,
      projectName: loan.projectName,
      package: loan.package,
      amount: loan.amount,
      purpose: loan.purpose,
      interestRate: loan.interestRate,
      creditRating: loan.creditRating,
      term: loan.term,
      funded: loan.funded,
      benefits: loan.benefits,
      description: loan.description,
      esgScore: Math.round((loan.esgDetails.environmental + loan.esgDetails.social + loan.esgDetails.governance) / 3)
    }));

    const prompt = `Bạn là trợ lý tư vấn đầu tư cho GreenFund, một nền tảng cho vay xanh tại Việt Nam.

Dưới đây là danh sách 16 khoản vay hiện có:
${JSON.stringify(loansInfo, null, 2)}

Người dùng nói: "${userMessage}"

Nhiệm vụ của bạn:
1. Phân tích nhu cầu và mong muốn của người dùng
2. Chọn RA ĐÚNG 1 khoản vay PHÙ HỢP NHẤT từ danh sách trên
3. Nếu KHÔNG CÓ khoản vay nào phù hợp hoặc yêu cầu không liên quan đến đầu tư/cho vay, trả về loanId = 0
4. Trả về CHÍNH XÁC theo format JSON sau (KHÔNG thêm markdown, KHÔNG thêm text nào khác):

{
  "loanId": [ID của khoản vay được chọn (1-16), hoặc 0 nếu không có khoản vay phù hợp],
  "reason": "[Lý do tại sao khoản vay này phù hợp, hoặc giải thích tại sao không có khoản vay phù hợp, viết ngắn gọn 2-3 câu bằng tiếng Việt]"
}

CHÚ Ý:
- CHỈ trả về JSON, KHÔNG có markdown code block
- loanId phải là số nguyên từ 0-16 (0 = không phù hợp, 1-16 = ID khoản vay)
- reason phải ngắn gọn, súc tích, dễ hiểu
- Nếu người dùng hỏi về thứ KHÔNG liên quan đến đầu tư xanh, cho vay, năng lượng, nông nghiệp, môi trường → trả về loanId = 0 !IMPORTANT`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Không thể kết nối với AI');
    }

    const data = await response.json();
    console.log(data)
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!aiResponse) {
      throw new Error('AI không trả về kết quả');
    }

    // Parse AI response
    let cleanedResponse = aiResponse.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const result = JSON.parse(cleanedResponse);
    
    // Validate result
    if (result.loanId === undefined || !result.reason) {
      throw new Error('AI trả về dữ liệu không hợp lệ');
    }

    // Check if no suitable loan (loanId = 0)
    if (result.loanId === 0) {
      return {
        loan: null,
        reason: result.reason
      };
    }

    // Find the loan
    const recommendedLoan = loansData.find(loan => loan.id === result.loanId);
    
    if (!recommendedLoan) {
      throw new Error('Không tìm thấy khoản vay');
    }

    return {
      loan: recommendedLoan,
      reason: result.reason
    };
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const { loan, reason } = await callGeminiAPI(userMessage);

      // Add bot response with loan recommendation
      setMessages(prev => [...prev, {
        type: 'bot',
        text: reason,
        loan: loan,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view loan detail
  const handleViewLoan = (loanId) => {
    navigate(`/loan-detail/${loanId}`);
    setIsOpen(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat với AI"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <FaRobot className="chatbot-header-icon" />
              <div>
                <h3>Trợ lý AI GreenFund</h3>
                <p>Gợi ý khoản vay phù hợp</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close">
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.type === 'bot' && (
                    <div className="message-avatar">
                      <FaRobot />
                    </div>
                  )}
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    
                    {/* Loan Recommendation Card */}
                    {message.loan && (
                      <div className="loan-recommendation">
                        <div className="loan-rec-header">
                          <h4>📊 Khoản vay được gợi ý</h4>
                        </div>
                        <div className="loan-rec-body">
                          <h5>{message.loan.projectName}</h5>
                          <div className="loan-rec-info">
                            <div className="loan-rec-item">
                              <span className="label">Số tiền:</span>
                              <span className="value">{formatCurrency(message.loan.amount)}</span>
                            </div>
                            <div className="loan-rec-item">
                              <span className="label">Lãi suất:</span>
                              <span className="value">{message.loan.interestRate}%/năm</span>
                            </div>
                            <div className="loan-rec-item">
                              <span className="label">Thời hạn:</span>
                              <span className="value">{message.loan.term} tháng</span>
                            </div>
                            <div className="loan-rec-item">
                              <span className="label">Xếp hạng:</span>
                              <span className="value rating">{message.loan.creditRating}</span>
                            </div>
                            <div className="loan-rec-item">
                              <span className="label">Đã huy động:</span>
                              <span className="value funded">{message.loan.funded}%</span>
                            </div>
                          </div>
                          <p className="loan-rec-purpose">{message.loan.purpose}</p>
                          <button 
                            className="loan-rec-button"
                            onClick={() => handleViewLoan(message.loan.id)}
                          >
                            Xem chi tiết khoản vay →
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Nhập nhu cầu của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
