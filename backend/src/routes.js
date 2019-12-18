/* CONTROLLERS */
const LoginController = require("./app/controllers/auth/LoginController");
const ForgotPassword = require("./app/controllers/auth/ForgotPassword");
const UserController = require("./app/controllers/UserController");
const OpinionController = require("./app/controllers/OpinionController");
const ModalController = require("./app/controllers/ModalController");
const CityController = require("./app/controllers/CityController");
const PathController = require("./app/controllers/PathController");
const ProviderController = require("./app/controllers/ProviderController");
const HolidayController = require("./app/controllers/HolidayController");
const ManualSearch = require("./app/controllers/services/ManualSearch");

/* MIDDLEWARES */
const UserAuthentication = require("./app/middlewares/UserAuthentication");
const authAdmin = require("./app/middlewares/AdminAuthentication");

const AuthUser = UserAuthentication();

module.exports = app => {
  /* ROTAS DE AUTENTICAÇÃO DE USUÁRIO */

  app.post("/login", LoginController.signIn);
  app.post("/validateToken", LoginController.validateToken);
  app.post("/forgot_password", ForgotPassword.recoverPass);

  /* ROTAS DE USUÁRIOS */

  /* CADASTRAR USUÁRIO SEM PRECISAR DE AUTENTICAÇÃO*/
  app.route("/users/sa").post(UserController.store);

  app
    .route("/users")
    .all(AuthUser.authenticate())
    .get(authAdmin(UserController.index))
    .post(authAdmin(UserController.store));

  app
    .route("/users/:data")
    .all(AuthUser.authenticate())
    .get(authAdmin(UserController.show))
    .put(authAdmin(UserController.update))
    .delete(authAdmin(UserController.delete));

  /* ROTAS DE CIDADE [COM AUTENTICAÇÃO] */

  // app.route('/cities')
  //    .all(AuthUser.authenticate())
  //    .get(authAdmin(CityController.index))
  //    .post(authAdmin(CityController.store));

  // app.route('/cities/:data')
  //    .all(AuthUser.authenticate())
  //    .get(CityController.show)
  //    .post(authAdmin(CityController.update))
  //    .delete(authAdmin(CityController.delete));

  /* ROTAS DE CIDADES [SEM AUTENTICAÇÃO] */

  app
    .route("/cities")
    .get(CityController.index)
    .post(CityController.store);

  app
    .route("/cities/:data")
    .get(CityController.show)
    .put(CityController.update)
    .delete(CityController.delete);

  /* PESQUISA MANUAL */

  app.route("/search").post(ManualSearch.index);

  /* ROTAS DE FERIADO [SEM AUTENTICAÇÃO]*/

  app
    .route("/holidays")
    .get(HolidayController.index)
    .post(HolidayController.store);

  app
    .route("/holidays/:data")
    .get(HolidayController.show)
    .put(HolidayController.update)
    .delete(HolidayController.delete);

  /* ROTA DE PROVEDORES  */

  app
    .route("/providers")
    // .all(AuthUser.authenticate())
    .get(ProviderController.index)
    .post(ProviderController.store);

  app
    .route("/providers/:data")
    .get(ProviderController.show)
    .put(ProviderController.update)
    .delete(ProviderController.delete);

  /* ROTAS DE TRAJETO [NÃO USAR - DEVE SER FINALIZADA*/

  // app.route('/paths')
  //    .all(AuthUser.authenticate())
  //    .get(PathController.index)
  //    .post(authAdmin(CityController.store));

  // app.route('/paths/:data')
  //    .all(AuthUser.authenticate())
  //    .get(PathController.show)
  //    .put(authAdmin(PathController.update))
  //    .delete(authAdmin(PathController.delete));

  /* ROTAS DE TRAJETO SEM PROTEÇÃO */

  app
    .route("/paths")
    .get(PathController.index)
    .post(PathController.store);

  app
    .route("/paths/:id")
    .get(PathController.show)
    .put(PathController.update)
    .delete(PathController.delete);

  /* ROTAS DE OPINIÕES */

  app
    .route("/opinions")
    .get(OpinionController.index)
    .post(OpinionController.store);

  app
    .route("/opinions/:id")
    .get(OpinionController.show)
    .put(OpinionController.update)
    .delete(OpinionController.delete);

  app
    .route("/modals")
    .all(AuthUser.authenticate())
    .get(ModalController.index)
    .post(authAdmin(ModalController.store));

  app
    .route("/modals/:data")
    .all(AuthUser.authenticate())
    .get(ModalController.show)
    .put(authAdmin(ModalController.update))
    .delete(authAdmin(ModalController.delete));

  /* ROTAS DE FERIADO [COM AUTENTICAÇÃO]*/

  // app.route('/holidays')
  //    .all(AuthUser.authenticate())
  //    .get(authAdmin(HolidayController.index))
  //    .post(authAdmin(HolidayController.store));

  // app.route('/holidays/:id')
  //    .get(authAdmin(HolidayController.show))
  //    .put(authAdmin(HolidayController.update))
  //    .delete(authAdmin(HolidayController.delete));
};
