import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form, Button, Container, Row, Col,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../utils/routes';
import useAuth from '../hooks/useAuth.hook';

const LoginPage = () => {
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const { t } = useTranslation();

  const validate = Yup.object({
    username: Yup
      .string()
      .min(4, t('loginPage.validation.minUsername'))
      .required(t('loginPage.validation.required')),
    password: Yup
      .string()
      .min(4, t('loginPage.validation.minPassword'))
      .required(t('loginPage.validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (value) => {
      const { username, password } = value;
      const userData = { username, password };
      try {
        const response = await axios.post(routes.loginPath(), userData);
        logIn(response.data);
        navigate('/');
        setAuthError(null);
      } catch (error) {
        if (!error.isAxiosError) {
          setAuthError(t('loginPage.validation.unknown'));
        }
        const { statusText } = error.response;
        const message = statusText === 'Unauthorized'
          ? t('loginPage.validation.wrongData')
          : t('loginPage.validation.unknown');
        setAuthError(message);
      }
    },
    validationSchema: validate,
  });
  return (
    <>
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <a href="/" className="navbar-brand">{t('loginPage.header')}</a>
        </Container>
      </nav>
      <Container className="mt-50 mt-5">
        <Row>
          <Col className=" border .mx-auto mb-5">
            <div style={{ padding: '15px' }}>
              <h1 className="text-center">{t('loginPage.formHeader')}</h1>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    name="username"
                    type="text"
                    placeholder={t('loginPage.placeholderLogin')}
                  />
                  {formik.touched.username && formik.errors.username && (
                  <Form.Text className="text-danger">
                    {formik.errors.username}
                  </Form.Text>
                  )}
                  <Form.Text className="text-danger" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    name="password"
                    type="password"
                    placeholder={t('loginPage.placeholderPassword')}
                  />
                  <Form.Text className="text-danger">
                    {formik.touched.password && formik.errors.password}
                  </Form.Text>
                </Form.Group>
                <Row>
                  <div>
                    <Button className="mb-10 w-100" variant="primary" type="submit">
                      {t('loginPage.submit')}
                    </Button>
                    <div className="text-danger">
                      {authError && <p>{authError}</p>}
                    </div>
                  </div>
                </Row>
              </Form>
            </div>
            <div className="card-footer mb-1">
              <div className="text-center">
                <span>
                  {t('loginPage.haveNotAccount')}
                  {' '}
                </span>
                <a href="/signup">
                  {t('loginPage.link')}
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
