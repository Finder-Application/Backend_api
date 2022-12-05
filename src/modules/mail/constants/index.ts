export const templateOtp = (otpCode: string, type: 'pw' | 'otp') => `<div
style="
  min-width: 100%;
  width: 100% !important;
  min-width: 300px;
  max-width: 100%;
  margin: 0 auto;
  font-family: 'SF Pro Text', Arial, sans-serif;
  min-height: 100%;
  padding: 0px;
  background-color: #e8e8e8;
"
bgcolor="#e8e8e8"
>
<div class="adM"></div>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tbody>
    <tr>
      <td align="center" border="0">
        <table
          style="width: 100%;"
          cellpadding="0"
          cellspacing="0"
          border="0"
        >
          <tbody>
            <tr>
              <td align="center" border="0">
                <table
                  style="width: 100%;"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tbody>
                    <tr>
                      <td
                        align="center"
                        style="
                          margin-left: 0px;
                          margin-right: 0px;
                          padding: 20px 0px 20px 0px;
                        "
                        border="0"
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <table
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 800px;"
          border="0"
        >
          <tbody>
            <tr>
              <td
                align="center"
                style="background-color: #ffffff;"
                bgcolor="#ffffff"
                border="0"
              >
                <table
                  style="max-width: 740px; width: 100%;"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tbody>
                    <tr>
                      <td
                        align="center"
                        style="
                          margin-left: 0px;
                          margin-right: 0px;
                          padding: 0px 15px 0px 15px;
                        "
                        border="0"
                      >
                        <table
                          style="width: 100%;"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  border-bottom: 3px solid #72bf00;
                                  padding: 20px 0px 20px 0px;
                                "
                              >
                                <table
                                  style="width: 100%;"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          font-size: 0px;
                                          padding: 0px 1px 0px 1px;
                                        "
                                        border="0"
                                      >
                                        <table
                                          style="width: 100%;"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  width: 68%;
                                                  font-size: 0px;
                                                  min-height: 1px;
                                                "
                                                border="0"
                                              >
                                                <table
                                                  style="
                                                    width: 100%;
                                                    max-width: 100%;
                                                    border-collapse: collapse;
                                                    word-break: break-word;
                                                  "
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  border="0"
                                                >
                                                  <tbody>
                                                    
                                                   
                                                  </tbody>
                                                </table>
                                              </td>
                                              
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="left"
                                style="padding: 30px 0px 20px 0px;"
                                border="0"
                              >
                                <p
                                  style="
                                    font-family: 'SF Pro Text', Arial,
                                      sans-serif;
                                    font-size: 24px;
                                    line-height: 29px;
                                    text-align: center;
                                    margin: 0px;
                                    color: #4a4a4a;
                                  "
                                >
                                  <b
                                    > ${type==='otp'?'Your otp':'Your password'} : ${otpCode}</b
                                  >
                                  <br />
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="left"
                                style="
                                  font-size: 14px;
                                  line-height: 20px;
                                  padding: 0px 0px 30px 0px;
                                "
                                border="0"
                              ></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <table
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 800px;"
          border="0"
        >
          <tbody>
            <tr>
              <td
                align="center"
                style="padding: 0px 0px 30px 0px;"
                border="0"
              ></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<div class="yj6qo"></div>
<div class="adL"></div>
</div>`;
