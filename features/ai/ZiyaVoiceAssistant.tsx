import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Send } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Button from '../../components/shared/ui/Button';
import { useLeads } from '../../contexts/LeadsContext';
import { useTasks } from '../../contexts/TasksContext';
import { useDeals } from '../../contexts/DealsContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isVoice?: boolean;
}

const ZiyaVoiceAssistant: React.FC = () => {
  const { leads } = useLeads();
  const { tasks } = useTasks();
  const { deals } = useDeals();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Ziya, your AI voice assistant. How can I help you today?",
      isVoice: true
    },
  ]);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          recognitionRef.current.maxAlternatives = 1;
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0])
              .map(result => result.transcript)
              .join('');
            setTranscript(transcript);
            console.log('Speech result:', transcript);
            
            // Check if this is a final result (not interim)
            if (event.results.length > 0 && event.results[event.results.length - 1].isFinal) {
              console.log('Final speech result:', transcript);
              // Process the final result immediately
              if (transcript.trim() !== '') {
                handleVoiceInput(transcript);
              }
              // Stop recognition after final result
              if (recognitionRef.current) {
                recognitionRef.current.stop();
              }
            }
          };
          
          recognitionRef.current.onspeechend = () => {
            console.log('Speech ended');
            // Don't stop recognition here - let it finish naturally
            // This was causing the issue where voice input wasn't processed
          };
          
          recognitionRef.current.onend = () => {
            console.log('Recognition ended, transcript:', transcript);
            // Process any remaining transcript that wasn't caught by onresult
            if (transcript && transcript.trim() !== '') {
              handleVoiceInput(transcript);
            }
            setIsListening(false);
            setTranscript('');
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            console.error('Error details:', event);
            setIsListening(false);
            setTranscript('');
            
            // Handle specific errors
            if (event.error === 'no-speech') {
              console.log('No speech detected, continuing to listen');
              // Don't stop listening for no-speech errors
              return;
            }
            
            if (event.error === 'audio-capture') {
              alert('No microphone found. Please check your audio devices.');
            } else if (event.error === 'not-allowed') {
              alert('Microphone access denied. Please allow microphone access to use voice commands.');
            } else {
              alert(`Speech recognition error: ${event.error}`);
            }
          };
        } else {
          console.log('Speech recognition not supported');
        }
      }
    };
    
    // Initialize speech recognition when component mounts
    initSpeechRecognition();
    
    // Also initialize speech synthesis voices
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = speechSynthesis.getVoices();
        console.log('Initial voices loaded:', voices.length);
        
        // If no voices are available yet, wait for the voiceschanged event
        if (voices.length === 0) {
          const voicesChangedHandler = () => {
            const newVoices = speechSynthesis.getVoices();
            console.log('Voices loaded after voiceschanged event:', newVoices.length);
            if (newVoices.length > 0) {
              console.log('Sample voice:', newVoices[0].name, newVoices[0].lang);
            }
          };
          
          speechSynthesis.onvoiceschanged = voicesChangedHandler;
          
          // Also try after a delay as a backup
          setTimeout(() => {
            const delayedVoices = speechSynthesis.getVoices();
            console.log('Voices loaded after delay:', delayedVoices.length);
          }, 1000);
        } else {
          console.log('Sample voice:', voices[0].name, voices[0].lang);
        }
      } else {
        console.log('Speech synthesis not supported in this browser');
      }
    };
    
    // Load voices immediately
    loadVoices();
    
    // Also load voices after a delay to ensure they're available
    setTimeout(loadVoices, 500);
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
    };
  }, []);

  const speakResponse = (text: string) => {
    console.log('Speaking response:', text);
    
    // Clean the text for better speech synthesis
    let cleanText = text.replace(/\*/g, '').replace(/#/g, '').replace(/\n/g, '. ').trim();
    
    // If text is empty, don't speak
    if (!cleanText) {
      console.log('No text to speak');
      return;
    }
    
    // Ensure text ends with punctuation for better speech flow
    if (!cleanText.endsWith('.') && !cleanText.endsWith('!') && !cleanText.endsWith('?')) {
      cleanText += '.';
    }
    
    console.log('Cleaned text for speech:', cleanText);
    
    // Force speech synthesis with multiple fallback approaches
    const forceSpeech = () => {
      try {
        // Method 1: Direct speech synthesis
        if ('speechSynthesis' in window) {
          console.log('Using speechSynthesis API');
          
          // Cancel any ongoing speech
          if (speechSynthesis.speaking) {
            console.log('Cancelling current speech');
            speechSynthesis.cancel();
          }
          
          // Create utterance
          const utterance = new SpeechSynthesisUtterance(cleanText);
          
          // Set properties for clear speech
          utterance.rate = 0.9;    // Slightly slower for clarity
          utterance.pitch = 1.0;   // Normal pitch
          utterance.volume = 1.0;  // Full volume
          
          // Try to get voices
          const voices = speechSynthesis.getVoices();
          console.log('Available voices:', voices.length);
          
          if (voices.length > 0) {
            // Find a good English voice
            const englishVoice = voices.find(voice => 
              voice.lang.includes('en-US') || voice.lang.includes('en-GB')
            );
            
            if (englishVoice) {
              utterance.voice = englishVoice;
              console.log('Using voice:', englishVoice.name);
            } else {
              // Use first available voice
              utterance.voice = voices[0];
              console.log('Using first available voice:', voices[0].name);
            }
          }
          
          // Add event listeners
          utterance.onstart = () => {
            console.log('Speech started successfully');
          };
          
          utterance.onend = () => {
            console.log('Speech completed successfully');
          };
          
          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            // Try fallback method
            fallbackSpeech(cleanText);
          };
          
          // Speak the text
          console.log('Speaking utterance now');
          speechSynthesis.speak(utterance);
          return true;
        } else {
          console.log('Speech synthesis not supported');
          fallbackSpeech(cleanText);
          return false;
        }
      } catch (error) {
        console.error('Error in forceSpeech:', error);
        fallbackSpeech(cleanText);
        return false;
      }
    };
    
    // Fallback speech method
    const fallbackSpeech = (text: string) => {
      console.log('Using fallback speech method');
      
      // Try again with a delay
      setTimeout(() => {
        try {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
              const englishVoice = voices.find(voice => 
                voice.lang.includes('en-US') || voice.lang.includes('en-GB')
              );
              if (englishVoice) {
                utterance.voice = englishVoice;
              } else {
                utterance.voice = voices[0];
              }
            }
            
            utterance.onend = () => console.log('Fallback speech completed');
            utterance.onerror = () => {
              console.error('Fallback speech also failed');
              // Last resort: alert
              alert(`Ziya says: ${text}`);
            };
            
            speechSynthesis.speak(utterance);
          } else {
            // Absolute fallback
            alert(`Ziya says: ${text}`);
          }
        } catch (error) {
          console.error('Fallback speech error:', error);
          alert(`Ziya says: ${text}`);
        }
      }, 500);
    };
    
    // Try to speak immediately
    const success = forceSpeech();
    
    // If it failed, try again after a delay to ensure voices are loaded
    if (!success) {
      console.log('Initial speech failed, retrying after delay');
      setTimeout(() => {
        forceSpeech();
      }, 1000);
    }
  };

  const getCRMContext = () => {
    // High-priority tasks
    const highPriorityTasks = tasks.filter(task => task.priority === 'High');
    
    // Active leads
    const activeLeads = leads.filter(lead => lead.status !== 'Lost' && lead.status !== 'Closed - Won');
    
    // Deals in negotiation
    const negotiationDeals = deals.filter(deal => deal.stage === 'Negotiation');
    
    // Completed tasks
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    
    // Won leads
    const wonLeads = leads.filter(lead => lead.status === 'Closed - Won').length;
    
    // Won deals
    const wonDeals = deals.filter(deal => deal.stage === 'Closed - Won').length;
    
    return `
CRM Data Summary:
- High Priority Tasks: ${highPriorityTasks.length}
- Active Leads: ${activeLeads.length}
- Deals in Negotiation: ${negotiationDeals.length}
- Completed Tasks: ${completedTasks}
- Won Leads: ${wonLeads}
- Won Deals: ${wonDeals}

Recent High Priority Tasks:
${highPriorityTasks.slice(0, 3).map(task => `- ${task.title} (Due: ${task.dueDate})`).join('\n')}

Recent Active Leads:
${activeLeads.slice(0, 3).map(lead => `- ${lead.firstName} ${lead.lastName} from ${lead.company} (${lead.status}, Score: ${lead.score})`).join('\n')}

Deals in Negotiation:
${negotiationDeals.slice(0, 3).map(deal => `- ${deal.name} with ${deal.accountName} (Value: $${deal.value.toLocaleString()}, Close Date: ${deal.closeDate})`).join('\n')}
`;
  };

  const generateResponseWithGemini = async (userInput: string) => {
    try {
      // Get Gemini API key from environment variables
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.warn('Gemini API key not found. Using fallback response system.');
        return generateFallbackResponse(userInput);
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const context = getCRMContext();
      
      const prompt = `
You are Ziya, a helpful and friendly AI voice assistant for a CRM system. You have access to the user's CRM data.

CRM Context:
${context}

Conversation History:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

User's Latest Question: ${userInput}

Please provide a helpful, conversational, and natural-sounding response based on the CRM data and conversation history. 
- If the question is about specific CRM data, use the provided context to give detailed and helpful information.
- If it's a general question, you can answer based on your knowledge.
- Make your responses sound natural and conversational, like a helpful colleague.
- Keep responses professional but friendly and engaging.
- For numerical data, present it in a conversational way (e.g., "You have 3 high-priority tasks that need your attention" rather than just "3 tasks").
- If you don't have specific information, be honest and suggest what the user might do instead.
- Keep responses concise but informative.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback to the original response generator
      return generateFallbackResponse(userInput);
    }
  };

  const generateFallbackResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // High-priority tasks summary
    if (lowerInput.includes('high-priority tasks') || lowerInput.includes('priority tasks') || lowerInput.includes('tasks')) {
      const highPriorityTasks = tasks.filter(task => task.priority === 'High');
      if (highPriorityTasks.length === 0) {
        return "Great news! You don't have any high-priority tasks right now. This is a perfect opportunity to focus on other important work or maybe even take a short break.";
      }
      
      const taskList = highPriorityTasks.map(task => `- ${task.title} which is due on ${task.dueDate}`).join('\n');
      return `I've found ${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''} that need your attention right away:\n${taskList}\n\nYou should probably tackle these first thing today.`;
    }
    
    // Hottest lead
    if (lowerInput.includes('hottest lead') || lowerInput.includes('best lead') || lowerInput.includes('lead')) {
      const contactedLeads = leads.filter(lead => lead.status === 'Contacted' || lead.status === 'Proposal' || lead.status === 'Negotiation');
      if (contactedLeads.length === 0) {
        return "I don't see any leads in active stages right now. This might be a good time to reach out to some new prospects or follow up with leads that may have gone cold.";
      }
      
      // Sort by score to find the hottest lead
      contactedLeads.sort((a, b) => b.score - a.score);
      const hottestLead = contactedLeads[0];
      
      return `Your hottest lead right now is ${hottestLead.firstName} ${hottestLead.lastName} from ${hottestLead.company}. They're currently in the ${hottestLead.status} stage with a strong score of ${hottestLead.score}. You can reach them at ${hottestLead.email} or by phone at ${hottestLead.phone}. This lead seems really promising!`;
    }
    
    // Biggest deals in negotiation
    if ((lowerInput.includes('biggest deals') || lowerInput.includes('deals') || lowerInput.includes('negotiation')) && (lowerInput.includes('negotiation') || lowerInput.includes('deal'))) {
      const negotiationDeals = deals.filter(deal => deal.stage === 'Negotiation');
      if (negotiationDeals.length === 0) {
        return "You don't have any deals currently in negotiation. That's perfectly fine - it just means you can focus on moving other deals forward or nurturing new prospects.";
      }
      
      // Sort by value to find biggest deals
      negotiationDeals.sort((a, b) => b.value - a.value);
      const biggestDeal = negotiationDeals[0];
      
      return `Your biggest deal in negotiation right now is "${biggestDeal.name}" with ${biggestDeal.accountName}. This is a substantial deal worth $${biggestDeal.value.toLocaleString()} and is expected to close on ${biggestDeal.closeDate}. This deal could really boost your quarterly numbers!`;
    }
    
    // Productivity report
    if (lowerInput.includes('productivity report') || lowerInput.includes('report') || lowerInput.includes('summary')) {
      const completedTasks = tasks.filter(task => task.status === 'Completed').length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const activeLeads = leads.filter(lead => lead.status !== 'Lost' && lead.status !== 'Closed - Won').length;
      const wonLeads = leads.filter(lead => lead.status === 'Closed - Won').length;
      
      const activeDeals = deals.filter(deal => deal.stage !== 'Closed - Won' && deal.stage !== 'Closed - Lost').length;
      const wonDeals = deals.filter(deal => deal.stage === 'Closed - Won').length;
      
      return `Here's a quick snapshot of your productivity:\n\nTasks: You've completed ${completedTasks} out of ${totalTasks} tasks, giving you a completion rate of ${completionRate}%.\nLeads: You're currently working with ${activeLeads} active leads and have successfully closed ${wonLeads} leads.\nDeals: You have ${activeDeals} deals in progress, with ${wonDeals} deals already closed.\n\nOverall, you're making solid progress! Keep up the great work.`;
    }
    
    // Help command
    if (lowerInput.includes('help') || lowerInput.includes('what can you do') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return `Hello there! I'm Ziya, your friendly AI voice assistant. I'm here to help you get the most out of your CRM. Here's what I can do for you:\n\n1. Tell you about your high-priority tasks\n2. Identify your hottest leads\n3. Show you your biggest deals in negotiation\n4. Give you a productivity summary\n5. Answer general questions about your CRM\n\nTry asking me things like:\n- "What are my high-priority tasks?"\n- "Who is my hottest lead?"\n- "Show me my biggest deals"\n- "Give me a productivity summary"\n\nHow can I help you today?`;
    }
    
    // Default conversational response
    return `I hear you asking about "${userInput}". As your CRM assistant, I can help you with your tasks, leads, deals, and productivity reports. Try asking me specific questions like "What are my high-priority tasks?" or "Who is my hottest lead?" and I'll give you detailed, helpful answers.`;
  };

  const handleVoiceInput = async (input: string) => {
    if (input.trim() === '') {
      console.log('Empty transcript, not processing');
      return;
    }

    console.log('Handling voice input:', input);
    const userMessage: Message = { role: 'user', content: input, isVoice: true };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Show typing indicator
      setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...', isVoice: true }]);
      
      // Generate response using Gemini or fallback
      const response = await generateResponseWithGemini(input);
      console.log('Generated response:', response);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove typing indicator
        newMessages.push({ role: 'assistant', content: response, isVoice: true });
        return newMessages;
      });
      
      // Speak the response
      console.log('About to speak response:', response);
      speakResponse(response);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = "Sorry, I encountered an error while processing your request. Please try again.";
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove typing indicator
        newMessages.push({ role: 'assistant', content: errorMessage, isVoice: true });
        return newMessages;
      });
      
      speakResponse(errorMessage);
    }
  };

  const handleTextInput = async () => {
    if (textInput.trim() === '') return;
    
    const input = textInput;
    setTextInput('');
    
    console.log('Handling text input:', input);
    const userMessage: Message = { role: 'user', content: input, isVoice: false };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Show typing indicator
      setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...', isVoice: false }]);
      
      // Generate response using Gemini or fallback
      const response = await generateResponseWithGemini(input);
      console.log('Generated response:', response);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove typing indicator
        newMessages.push({ role: 'assistant', content: response, isVoice: false });
        return newMessages;
      });
      
      // Speak the response
      console.log('About to speak response (text input):', response);
      speakResponse(response);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = "Sorry, I encountered an error while processing your request. Please try again.";
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove typing indicator
        newMessages.push({ role: 'assistant', content: errorMessage, isVoice: false });
        return newMessages;
      });
      
      speakResponse(errorMessage);
    }
  };

  const toggleListening = () => {
    console.log('Toggle listening called, current state:', isListening);
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }
    
    if (isListening) {
      console.log('Stopping recognition');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
      setIsListening(false);
    } else {
      console.log('Starting recognition');
      setTranscript('');
      if (recognitionRef.current) {
        try {
          // Reset the recognition object for a fresh start
          recognitionRef.current.lang = 'en-US';
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = true;
          
          // Add a small delay to ensure proper initialization
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
            console.log('Recognition started successfully');
          }, 100);
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          alert('Failed to start voice recognition. Please try again.');
          setIsListening(false);
        }
      }
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // When opening, add a welcome message if it's the first time
      if (messages.length === 1) {
        setTimeout(() => {
          speakResponse("Hello! I'm Ziya, your AI voice assistant. How can I help you today?");
        }, 500);
      }
    }
  };

  // Test speech synthesis function for debugging
  const testSpeech = () => {
    console.log('Testing speech synthesis...');
    speakResponse("This is a test message from Ziya. If you can hear this, voice responses are working correctly.");
  };

  return (
    <>
      {/* Floating Voice Assistant Button */}
      <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
        aria-label="Ziya Voice Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-text-main">Ziya Voice Assistant</h2>
              </div>
              <button 
                onClick={toggleAssistant} 
                className="p-1 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 h-96 flex flex-col">
              {/* Messages display area */}
              <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-3">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                    <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : ''} max-w-[80%]`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary text-white ml-2' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-2'}`}>
                        {message.role === 'user' ? 'You' : 'Z'}
                      </div>
                      <div className={`rounded-lg px-3 py-2 ${message.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="mt-auto">
                {/* Text input for testing */}
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleTextInput}
                    className="bg-primary text-white px-3 rounded-r-lg hover:bg-primary-dark transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Test speech button - only shown in development */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={testSpeech}
                    className="mb-2 w-full bg-yellow-500 text-white py-1 px-2 rounded text-xs hover:bg-yellow-600 transition-colors"
                  >
                    Test Voice (Dev Only)
                  </button>
                )}
                
                {isListening && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">Listening...</p>
                    <p className="text-sm text-blue-600 mt-1">{transcript || 'Speak now...'}</p>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-110 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    }`}
                    aria-label={isListening ? "Stop listening" : "Start listening"}
                  >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                </div>
                
                <p className="text-xs text-center text-gray-500 mt-2">
                  {isListening ? 'Click to stop' : 'Click microphone to speak'}
                </p>
                
                {/* Debug info */}
                <p className="text-xs text-center text-gray-400 mt-1">
                  Status: {isListening ? 'Listening' : 'Ready'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden audio element for playing responses */}
      <audio ref={audioRef} />
    </>
  );
};

export default ZiyaVoiceAssistant;