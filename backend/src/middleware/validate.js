import { AppError } from './errorHandler.js';

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            const errors = error.errors?.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            return next(new AppError(errors?.[0]?.message || 'Validation failed', 400));
        }
    };
};
