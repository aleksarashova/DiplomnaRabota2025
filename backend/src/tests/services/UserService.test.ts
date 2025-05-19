jest.mock('../../models/User');

jest.mock('bcryptjs');

jest.mock('../../shared/utils', () => ({
    checkIdFormat: jest.fn(),
    checkEmailFormat: jest.fn(() => true),
}));

import User from "../../models/User";
import bcrypt from 'bcryptjs';

import {
    checkForRightPassword,
    createUser,
    hashPassword,
} from '../../services/UserService';

import { findUserByUsername } from '../../services/UserService';
import { getAverageRating } from '../../services/UserService';

export const deleteUserMinimal = async (id: string): Promise<void> => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    await user.deleteOne();
}

beforeEach(() => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('hashPassword', () => {
    it('should return a hashed password', async () => {
        const password = 'mySecret123';
        const hash = await hashPassword(password);

        expect(typeof hash).toBe('string');
        expect(hash).not.toBe(password);
        expect(hash.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw an error when bcrypt.genSalt fails', async () => {
        (bcrypt.genSalt as jest.Mock).mockRejectedValueOnce(new Error('Salt error'));

        await expect(hashPassword('test')).rejects.toThrow('Salt error');
    });
});

describe('checkForRightPassword', () => {
    it('should return true for the correct password', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

        const password = 'correctPassword123';
        const hash = await hashPassword(password);

        const result = await checkForRightPassword(password, hash);
        expect(result).toBe(true);
    });

    it('should return false for the incorrect password', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

        const result = await checkForRightPassword('wrongPassword', 'someHash');

        expect(result).toBe(false);
    });
});

describe('createUser', () => {
    it('should create a new user and save it', async () => {
        const userData = {
            first_name: 'John',
            last_name: 'Doe',
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            image: 'image.png',
        };

        (User as unknown as jest.Mock).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(undefined),
        }));

        await createUser(userData);

        expect(User).toHaveBeenCalledWith(expect.objectContaining({
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
            password_hash: 'hashedPassword',
            image: userData.image,
        }));

        const userInstance = (User as unknown as jest.Mock).mock.results[0].value;
        expect(userInstance.save).toHaveBeenCalled();
    });
});

describe('deleteUserMinimal', () => {
    const mockUserId = '507f191e810c19729de860ea';

    beforeEach(() => {
        (User.findById as jest.Mock).mockResolvedValue({
            deleteOne: jest.fn().mockResolvedValue(undefined),
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call deleteOne on the user', async () => {
        await deleteUserMinimal(mockUserId);

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        const userInstance = await User.findById(mockUserId);
        expect(userInstance!.deleteOne).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
        (User.findById as jest.Mock).mockResolvedValue(null);

        await expect(deleteUserMinimal(mockUserId)).rejects.toThrow('User not found');
    });
});

describe('getAverageRating', () => {
    it('should return correct average rating', async () => {
        const mockUser = {
            ratings: [
                { rating: 4 },
                { rating: 5 },
                { rating: 3 }
            ],
        };

        (findUserByUsername as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

        const result = await getAverageRating('someUsername');
        expect(result).toBe(4);
    });

    it('should return 0 if user has no ratings', async () => {
        const mockUser = {
            ratings: [],
        };

        (findUserByUsername as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

        const result = await getAverageRating('someUsername');
        expect(result).toBe(0);
    });

    it('should throw error if user not found', async () => {
        (findUserByUsername as jest.Mock) = jest.fn().mockResolvedValue(null);

        await expect(getAverageRating('someUsername')).rejects.toThrow('User not found.');
    });
});
