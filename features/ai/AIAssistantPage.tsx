import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import Button from '../../components/shared/ui/Button';
import { useLeads } from '../../contexts/LeadsContext';
import { useTasks } from '../../contexts/TasksContext';
import { useDeals } from '../../contexts/DealsContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistantPage: React.FC = () => {
  const { leads } = useLeads();
  const { tasks } = useTasks();
  const { deals } = useDeals();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Summarize my high-priority tasks',
    'Draft a follow-up email to my hottest lead',
    'What are my biggest deals in negotiation?',
    'Generate a productivity report for me',
  ];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const generateResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // High-priority tasks summary
    if (lowerInput.includes('high-priority tasks') || lowerInput.includes('priority tasks')) {
      const highPriorityTasks = tasks.filter(task => task.priority === 'High');
      if (highPriorityTasks.length === 0) {
        return "You don't have any high-priority tasks at the moment. Great job staying on top of your work!";
      }
      
      const taskList = highPriorityTasks.map(task => `- ${task.title} (Due: ${task.dueDate})`).join('\n');
      return `Here are your high-priority tasks:

${taskList}

You have ${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''} that require immediate attention.`;
    }
    
    // Hottest lead
    if (lowerInput.includes('hottest lead') || lowerInput.includes('best lead')) {
      const contactedLeads = leads.filter(lead => lead.status === 'Contacted' || lead.status === 'Proposal' || lead.status === 'Negotiation');
      if (contactedLeads.length === 0) {
        return "You don't have any leads in active stages right now. Consider reaching out to some new leads!";
      }
      
      // Sort by score to find the hottest lead
      contactedLeads.sort((a, b) => b.score - a.score);
      const hottestLead = contactedLeads[0];
      
      return `Your hottest lead is ${hottestLead.firstName} ${hottestLead.lastName} from ${hottestLead.company}. They are currently in the ${hottestLead.status} stage with a score of ${hottestLead.score}. Their contact information is ${hottestLead.email} and ${hottestLead.phone}.`;
    }
    
    // Biggest deals in negotiation
    if (lowerInput.includes('biggest deals') && lowerInput.includes('negotiation')) {
      const negotiationDeals = deals.filter(deal => deal.stage === 'Negotiation');
      if (negotiationDeals.length === 0) {
        return "You don't have any deals currently in negotiation. Keep up the great work on your pipeline!";
      }
      
      // Sort by value to find biggest deals
      negotiationDeals.sort((a, b) => b.value - a.value);
      const biggestDeal = negotiationDeals[0];
      
      return `Your biggest deal in negotiation is "${biggestDeal.name}" with ${biggestDeal.accountName}. The deal is worth $${biggestDeal.value.toLocaleString()} and is expected to close on ${biggestDeal.closeDate}.`;
    }
    
    // Productivity report
    if (lowerInput.includes('productivity report')) {
      const completedTasks = tasks.filter(task => task.status === 'Completed').length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const activeLeads = leads.filter(lead => lead.status !== 'Lost' && lead.status !== 'Closed - Won').length;
      const wonLeads = leads.filter(lead => lead.status === 'Closed - Won').length;
      
      const activeDeals = deals.filter(deal => deal.stage !== 'Closed - Won' && deal.stage !== 'Closed - Lost').length;
      const wonDeals = deals.filter(deal => deal.stage === 'Closed - Won').length;
      
      return `Here's your productivity report:\n\n` +
             `Tasks: ${completedTasks}/${totalTasks} completed (${completionRate}% completion rate)\n` +
             `Leads: ${activeLeads} active, ${wonLeads} won\n` +
             `Deals: ${activeDeals} active, ${wonDeals} closed\n\n` +
             `Keep up the great work!`;
    }
    
    // Default response
    return `I understand you're asking about "${userInput}". Based on your CRM data, I can help with:\n\n` +
           `- Summarizing your high-priority tasks\n` +
           `- Identifying your hottest leads\n` +
           `- Finding your biggest deals in negotiation\n` +
           `- Generating productivity reports\n\n` +
           `Try one of these suggestions or ask me something else!`;
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateResponse(input);
      const aiResponse: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-main">AI Assistant</h1>
                <p className="text-text-light mt-1">Get insights and automate tasks with AI.</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-text-main mb-2">AI Assistant</h1>
        <p className="text-text-light mb-6">Ask me anything about your CRM data, I'm here to help!</p>
        
        {/* Messages display area */}
        <div className="mb-6 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : ''} max-w-3/4`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary text-white ml-2' : 'bg-gray-200 text-gray-700 mr-2'}`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex max-w-3/4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-700 mr-2 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="rounded-lg px-4 py-2 bg-white border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="mt-6">
          {messages.length <= 1 && !isLoading && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Try a suggestion:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <Button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    variant="outline"
                    size="sm"
                    className="rounded-full transition-colors"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask the AI assistant..."
              rows={1}
              className="w-full border border-gray-300 rounded-lg py-3 pl-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ''}
              variant="primary"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;