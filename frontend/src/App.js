import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyEmailAndPhone from './pages/VerifyEmailAndPhone';
import PostJob from './pages/PostJob';
import CreateInterview from './pages/CreateInterview';
import Signup from './pages/Signup';
import PRoute from './pages/Proute';
import SendJobAlerts from './pages/SendJobAlerts';

function App() {
  return (
    <div className="App">
          
          <BrowserRouter>
                 <Routes>
                    <Route path='/' element={<Signup />} />
                    <Route element={<PRoute />}>
                        <Route path='/company/VerifyEmailAndPhone' element={<VerifyEmailAndPhone />} />
                        <Route path='/company/postJob' element={<PostJob />} />
                        <Route path='/company/createInterview' element={<CreateInterview />} />
                        <Route  path="/company/sendJobAlertsToMany" element={ <SendJobAlerts /> } />
                    </Route>
                </Routes>

                  <ToastContainer />
          </BrowserRouter>
    </div>
  );
}

export default App;
