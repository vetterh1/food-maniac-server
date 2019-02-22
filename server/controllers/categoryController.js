import * as logger from 'winston';
import sanitizeHtml from 'sanitize-html'; // sanitizeHtml escapes &<>" : s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
import Category from '../models/category';


/*
 * Get all categories
 */
export function getCategories(req, res) {
  Category.find().sort('_id').exec((err, categories) => {
    if (err) {
      logger.error('categoryController.getCategories returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ categories });
      res.set('Cache-Control', 'public, max-age=9000000'); // 15mn
      logger.info(`categoryController.getCategories length=${categories.length}`);
      // logger.info('getCategories:', JSON.stringify(categories));
    }
  });
}


/*
 * Add a category
 */

export function addCategory(req, res) {
  if (!req.body || !req.body.category || !req.body.category.name) {
    logger.error('categoryController.addCategory failed - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.category) logger.error('... no req.body.category!');
    if (req.body && req.body.category && !req.body.category.name) logger.error('... no req.body.category.name!');
    res.status(400).end();
  } else {
    const newCategory = new Category(req.body.category);

    // Let's sanitize inputs
    newCategory.name = sanitizeHtml(newCategory.name);

    newCategory.save((err, saved) => {
      if (err) {
        logger.error(`categoryController.addCategory ${newCategory.name} failed - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ category: saved });
        logger.info(`categoryController.addCategory ${newCategory.name} (_id=${saved._id})`);
      }
    });
  }
}


/*
 * Get a single category
 */
export function getCategory(req, res) {
  Category.findById(req.params._id).exec((err, category) => {
    if (err || !category) {
      logger.error(`categoryController.getCategory ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ category });
      logger.info(`categoryController.getCategory ${category.last} (_id=${req.params._id})`);
    }
  });
}


/*
 * Update an existing category
 */
export function updateCategory(req, res) {
  if (!req.body || !req.body.category) {
    const error = { status: 'error', message: 'categoryController.updateCategory failed - no body or category' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.category) error.message += '... no req.body.category!';
    res.status(400).json(error);
  } else if (req.body && req.body.category && req.body.category._id) {
    res.status(400).json({ status: 'error', message: 'categoryController.updateCategory failed - _id cannot be changed' });
  } else {
    Category.findOneAndUpdate({ _id: req.params._id }, req.body.category, { new: true }, (err, category) => {
      if (err || !category) {
        logger.error(`categoryController.updateCategory ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ category });
        logger.info(`categoryController.updateCategory ${req.params._id}`);
      }
    }); 
  }
}



/*
 * Delete an existing category
 */
export function deleteCategory(req, res) {
  Category.findOne({ _id: req.params._id }).exec((err, category) => {
    if (err || !category) {
      logger.error(`categoryController.deleteCategory ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      category.remove(() => {
        if (err) {
          logger.error(`categoryController.deleteCategory ${req.params._id} failed to remove - err = `, err);
          res.status(500).send(err);
        }
        else {
          res.status(200).end();
          logger.info(`categoryController.deleteCategory ${req.params._id}`);
        }
      });
    }
  });
}
