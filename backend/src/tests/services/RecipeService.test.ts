jest.mock('../../models/Recipe');
jest.mock('../../services/CategoryService', () => ({
    getCategoryIdByName: jest.fn(),
}));
jest.mock('../../services/UserService', () => ({
    findUserById: jest.fn(),
}));
jest.mock('../../shared/utils', () => ({
    checkIdFormat: jest.fn(),
}));

import Recipe from '../../models/Recipe';
import { getCategoryIdByName } from '../../services/CategoryService';
import { findUserById } from '../../services/UserService';
import { checkIdFormat } from '../../shared/utils';

import {addRecipe, findRecipeById} from '../../services/RecipeService';
import {AddRecipeDTO} from "../../DTOs/RecipeDTOs";

import { getNumberOfUnapprovedRecipes } from '../../services/RecipeService';

describe('addRecipe', () => {
    const mockUserId = '507f191e810c19729de860ea';
    const mockCategoryId = '609f191e810c19729de860eb';

    const recipeData: AddRecipeDTO = {
        title: 'Test Recipe',
        category: 'Dessert',
        time_for_cooking: '30 minutes',
        servings: 4,
        products: ['sugar', 'flour'],
        preparation_steps: ['Step 1', 'Step 2'],
        image: 'image.png',
    };

    beforeEach(() => {
        (checkIdFormat as jest.Mock).mockClear();
        (getCategoryIdByName as jest.Mock).mockClear();
        (findUserById as jest.Mock).mockClear();
        (Recipe as unknown as jest.Mock).mockClear();
    });

    it('should create a new recipe and save it, and update user recipes', async () => {
        (checkIdFormat as jest.Mock).mockImplementation(() => true);
        (getCategoryIdByName as jest.Mock).mockResolvedValue(mockCategoryId);

        const mockSaveRecipe = jest.fn().mockResolvedValue(undefined);
        const mockSaveUser = jest.fn().mockResolvedValue(undefined);

        const mockAuthor = {
            recipes: [],
            save: mockSaveUser,
        };

        (findUserById as jest.Mock).mockResolvedValue(mockAuthor);

        (Recipe as unknown as jest.Mock).mockImplementation(function(this: any, recipe) {
            this._id = 'newRecipeId';
            Object.assign(this, recipe);
            this.save = mockSaveRecipe;
        });

        const result = await addRecipe(recipeData, mockUserId);

        expect(checkIdFormat).toHaveBeenCalledWith(mockUserId);
        expect(getCategoryIdByName).toHaveBeenCalledWith(recipeData.category);
        expect(findUserById).toHaveBeenCalledWith(mockUserId);

        expect(Recipe).toHaveBeenCalledWith(expect.objectContaining({
            title: recipeData.title,
            category: mockCategoryId,
            author: expect.anything(),
            time_for_cooking: recipeData.time_for_cooking,
            servings: recipeData.servings,
            products: recipeData.products,
            preparation_steps: recipeData.preparation_steps,
            image: recipeData.image,
            is_approved: false,
            likes: 0,
            comments: [],
        }));

        expect(mockSaveRecipe).toHaveBeenCalled();
        expect(mockAuthor.recipes).toContain('newRecipeId');
        expect(mockSaveUser).toHaveBeenCalled();

        expect(result).toHaveProperty('_id', 'newRecipeId');
        expect(result.title).toBe(recipeData.title);
    });

    it('should throw error if user not found', async () => {
        (checkIdFormat as jest.Mock).mockImplementation(() => true);
        (getCategoryIdByName as jest.Mock).mockResolvedValue(mockCategoryId);
        (findUserById as jest.Mock).mockResolvedValue(null);

        await expect(addRecipe(recipeData, mockUserId)).rejects.toThrow('User not found when trying to add a recipe.');
    });
});

describe('findRecipeById', () => {
    const mockRecipeId = '507f191e810c19729de860ea';

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return a recipe when found', async () => {
        const mockRecipe = { _id: mockRecipeId, title: 'Mock Recipe' };

        (checkIdFormat as jest.Mock).mockImplementation(() => {});
        (Recipe.findOne as jest.Mock).mockResolvedValue(mockRecipe);

        const result = await findRecipeById(mockRecipeId);

        expect(checkIdFormat).toHaveBeenCalledWith(mockRecipeId);
        expect(Recipe.findOne).toHaveBeenCalledWith({ _id: mockRecipeId });
        expect(result).toBe(mockRecipe);
    });

    it('should throw error if checkIdFormat throws', async () => {
        (checkIdFormat as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid ID format');
        });

        await expect(findRecipeById(mockRecipeId)).rejects.toThrow('Invalid ID format');
    });

    it('should throw error if Recipe.findOne throws', async () => {
        (checkIdFormat as jest.Mock).mockImplementation(() => {});
        (Recipe.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

        await expect(findRecipeById(mockRecipeId)).rejects.toThrow('DB error');
    });
});

describe('getNumberOfUnapprovedRecipes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return the count of unapproved recipes', async () => {
        (Recipe.countDocuments as jest.Mock).mockResolvedValue(5);

        const result = await getNumberOfUnapprovedRecipes();

        expect(Recipe.countDocuments).toHaveBeenCalledWith({ is_approved: false });
        expect(result).toBe(5);
    });

    it('should throw error if countDocuments throws', async () => {
        (Recipe.countDocuments as jest.Mock).mockRejectedValue(new Error('DB error'));

        await expect(getNumberOfUnapprovedRecipes()).rejects.toThrow('DB error');
    });
});

