import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { xLogin } from "../../utils/auth";
import { Button } from "../../components/shared/Button";
import { Input } from "../../components/shared/Input";
import { useStoreActions } from "easy-peasy";
import { useToast } from "../../hooks/useToast";
import { QuickLogin } from "../../utils/development";
import { useTranslation } from "../../i18n/provider";
import { isTenant, brandLogo } from "../../tenant-config";
import { cl } from "../../utils/misc";

export default function LoginPage() {
  const setAuth = useStoreActions((actions) => actions.auth.setAuth);
  const [fields, setFields] = useState({ phone: "", password: "" });
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await xLogin(fields);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    showToast("Success", "success");
    setAuth({ user: data });
  }

  return (
    <Fragment>
      <div
        className={cl(
          "flex max-w-sm mx-auto bg-white rounded-lg shadow-lg w-full overflow-hidden",
          { "lg:max-w-4xl": !isTenant },
          { "lg:max-w-2xl": isTenant }
        )}
        style={{
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.07), inset 0 -10px 15px 5px rgba(0, 0, 0, 0.05)",
        }}>
        {!isTenant && (
          <div
            className="hidden bg-cover lg:block lg:w-1/2 bg-gray-100"
            style={{
              backgroundImage: "url(/img/login-deliverer.png)",
              boxShadow:
                "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
            }}></div>
        )}
        <div className={cl("w-full px-6 py-8 md:px-8", { "lg:w-1/2": !isTenant })}>
          <img className="mx-auto pb-5 max-h-[95px] max-w-[250px]" src={brandLogo} alt="" />
          <p className="text-xl text-center text-gray-700 font-sans">{tl("welcome")}</p>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("phone")}
              </label>
              <Input
                value={fields.phone}
                placeholder="0000000000"
                type="tel"
                pattern="[0-9]*"
                onChange={(e) => {
                  if (e.target.value.length > 10) return;
                  if (!e.target.validity.valid && !!e.target.value) return;
                  setFields({
                    ...fields,
                    phone: e.target.value,
                  });
                }}
                disabled={isLoading}
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("password")}
                </label>
                {/* <div className="text-xs text-gray-500 hover:underline cursor-pointer mb-2">
                  {tl("forgot_password")}
                </div> */}
              </div>

              <Input
                value={fields.password}
                onValueChange={(password) => setFields({ ...fields, password })}
                disabled={isLoading}
                type="password"
                placeholder="*******"
              />
            </div>

            <div className="mt-8">
              <Button label={tl("login")} type="submit" isLoading={isLoading} />
            </div>
          </form>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b "></span>

            <Link to="/register" className="text-md font-bold text-link uppercase hover:underline">
              {tl("or")} {tl("sign_up")}
            </Link>

            <span className="w-1/5 border-b"></span>
          </div>
        </div>
        {window.location.hostname.includes("livo.ma") && (
          <a href="https://wa.me/212675222777" className="float" target="_blank">
            <i className="fab fa-whatsapp my-float"></i>
          </a>
        )}
      </div>
      {(window.location.hostname.includes("staging") ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("testing")) && <QuickLogin />}
    </Fragment>
  );
}
