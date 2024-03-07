const { Router } = require('express');
// eslint-disable-next-line no-unused-vars
const UserService = require('../../services/UserService');

const router = Router();

module.exports = () => {
  /**
   * GET route to display the login form
   */
  router.get('/login', (req, res) => {
    res.render('auth/login', { page: 'login' });
  });

  /**
   * POST route to process the login form or display it again along with an error message in case validation fails
   */
  router.post('/login', async (req, res, next) => {
    try {
      const errors = [];
      /**
       * @todo: Try to find the user in the database and try to validate the password
       */

      const user = await UserService.findByUsername(req.body.username);

      if (!user) {
        // To be ambiguous, we don't want to tell the user if the username or password is wrong
        errors.push('username');
        errors.push('password');

        // Render the page again and show the errors
        req.session.messages.push({
          type: 'danger',
          text: 'Invalid username or password',
        });
      } else if (user && !user.verified) {
        errors.push('username');
        errors.push('password');

        req.session.messages.push({
          type: 'danger',
          text: 'Please verify your email address before logging in',
        });
      } else {
        const isValid = await user.comparePassword(
          req.body.password,
          user.password
        );
        if (!isValid) {
          errors.push('username');
          errors.push('password');

          req.session.messages.push({
            type: 'danger',
            text: 'Invalid username or password',
          });
        }
      }

      if (errors.length) {
        // Render the page again and show the errors
        return res.render('auth/login', {
          page: 'login',
          data: req.body,
          errors,
        });
      }
      /**
       * Log the user in by saving the userid to the session and redirect to the index page
       * Add 'Remember me' by setting a cookie with a token and saving the token to the user with a max age
       */

      req.session.userId = user.id;
      req.session.messages.push({
        type: 'success',
        text: 'You have been logged in',
      });

      // Setting a cookie with a token and saving the token to the user with a max age
      if (req.body.remember) {
        req.sessionOptions.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
        req.session.rememberme = req.sessionOptions.maxAge;
      } else {
        req.session.rememberme = null;
      }

      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  });

  /**
   * GET route to log a user out
   * @todo: Implement
   */
  router.get('/logout', (req, res) => {
    req.session.userId = null;
    req.session.rememberme = null;

    req.session.messages.push({
      type: 'info',
      text: 'You have been logged out',
    });
    return res.redirect('/');
  });

  return router;
};
