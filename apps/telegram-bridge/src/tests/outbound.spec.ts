import { Outbound } from '../outbound';
import axios from 'axios';
import { telegram } from "@ts-assistant/mqtt-assistant";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Outbound', () => {
  let outbound: Outbound;
  const mockPost = jest.fn().mockResolvedValue({}); // Returns a resolved Promise

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    process.env.TELEGRAM_ADMIN_ID = 'admin-id';
    process.env.TELEGRAM_USER_ID = 'user-id';
    mockedAxios.create.mockReturnValue({ post: mockPost } as any);
  });

  describe('constructor', () => {
    it('should throw error when TELEGRAM_BOT_TOKEN is missing', () => {
      delete process.env.TELEGRAM_BOT_TOKEN;
      expect(() => new Outbound()).toThrow('[!] Missing TELEGRAM_BOT_TOKEN');
    });

    it('should initialize with correct configuration', () => {
      outbound = new Outbound();
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.telegram.org/bottest-token',
        timeout: 1000
      });
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      outbound = new Outbound();
    });

    it('should send to admin by default', () => {
      outbound['sendMessage']('test message');
      expect(mockPost).toHaveBeenCalledWith('/sendMessage', {
        chat_id: 'admin-id',
        text: 'test message',
        parse_mode: 'MarkdownV2'
      });
    });

    it('should send to specified recipient', () => {
      outbound['sendMessage']('test message', { recipient: 'user' });
      expect(mockPost).toHaveBeenCalledWith('/sendMessage', {
        chat_id: 'user-id',
        text: 'test message',
        parse_mode: 'MarkdownV2'
      });
    });
  });

  describe('handle', () => {
    beforeEach(() => {
      outbound = new Outbound();
    });

    it('should format message with log level and icons', () => {
      const mockMessage = {
        message: 'test message',
        recipient: 'admin' as telegram.TelegramRecipients
      };
      
      outbound.handle('topic/debug', JSON.stringify(mockMessage));
      expect(mockPost).toHaveBeenCalledWith('/sendMessage', {
        chat_id: 'admin-id',
        text: '🧪 *DEBUG:* test message',
        parse_mode: 'MarkdownV2'
      });
    });

    it('should include title when provided', () => {
      const mockMessage = {
        title: 'Test Title',
        message: 'test message',
        recipient: 'admin' as telegram.TelegramRecipients
      };
      
      outbound.handle('topic/info', JSON.stringify(mockMessage));
      expect(mockPost).toHaveBeenCalledWith('/sendMessage', {
        chat_id: 'admin-id',
        text: 'ℹ️ *INFO:* *Test Title*\ntest message',
        parse_mode: 'MarkdownV2'
      });
    });

    it('should handle malformed JSON messages', () => {
      outbound.handle('topic/info', 'invalid json');
      expect(mockPost).toHaveBeenCalledWith('/sendMessage', {
        chat_id: 'admin-id',
        text: 'invalid json',
        parse_mode: 'MarkdownV2'
      });
    });
  });
});