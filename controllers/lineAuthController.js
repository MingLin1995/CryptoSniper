// controllers/lineAuthController.js

const lineAuthCallback = (req, res) => {
  if (req.user) {
    const { user, token, telegramId } = req.user;
    res.redirect(
      `/?token=${token}&userId=${user._id}&telegramId=${telegramId || ""}`
    );
  } else {
    res.redirect("/");
  }
};

module.exports = {
  lineAuthCallback,
};
