// Rename the component to start with uppercase
const ForgotPassword2 = () => {
  return (
    <>
      <section className="bl_section">
        <div className="bf_wrapper">
          <img src="./src/images/logo.png" className="k_logo" alt="" />
          <h1 className="bl_head">Verify Code</h1>
          <p className="bl_sub_head">Enter 6 digit code sent to <span className="sent_email">gurpreet.singh@digisoftsolution.com</span></p>
          <div className="input_field verfication_code_field">
              <input type="text" placeholder="" className="form-control" />
              <input type="text" placeholder="" className="form-control" />
              <input type="text" placeholder="" className="form-control" />
              <input type="text" placeholder="" className="form-control" />
              <input type="text" placeholder="" className="form-control" />
              <input type="text" placeholder="" className="form-control" />
          </div>
          
          <button className="btn common_button mt-2">Verify Code</button>
          <small className="code_receive_after">
Didn't receive the code? Resend in 0:35</small>
{/* <small className="code_receive_after">
Didn't receive the code? <a href="" className="resend_now">Resend Code</a></small> */}
        </div>
      </section>
    </>
  );
};

export default ForgotPassword2;
