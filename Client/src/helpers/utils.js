import axios from "../axios";
export function utils() {
  let realFetch = window.fetch;
  let user = null;
  window.fetch = function (url, opts) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url.endsWith("/users/authenticate") && opts.method === "POST") {
          let params = JSON.parse(opts.body);

          axios.post("/AuthenticateUser", params).then((res) => {
            console.log(res);
            console.log(res.data);
            user = res.data[0];

            if (user) {
              let responseJson = {
                id: user.UserID,
                username: user.UserName,
                firstName: user.FirstName,
                lastName: user.LastName,
                role: user.Type,
                token:
                  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDb2RlcnRoZW1lIiwiaWF0IjoxNTU1NjgyNTc1LCJleHAiOjE1ODcyMTg1NzUsImF1ZCI6ImNvZGVydGhlbWVzLmNvbSIsInN1YiI6InRlc3QiLCJmaXJzdG5hbWUiOiJIeXBlciIsImxhc3RuYW1lIjoiVGVzdCIsIkVtYWlsIjoidGVzdEBoeXBlci5jb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4ifQ.8qHJDbs5nw4FBTr3F8Xc1NJYOMSJmGnRma7pji0YwB4",
              };
              resolve({ ok: true, json: () => responseJson });
            } else {
              reject("Username or password is incorrect");
            }

            return;
          });
        }
      });
      //realFetch(url, opts).then((response) => resolve(response));
    }, 500);
  };
}
