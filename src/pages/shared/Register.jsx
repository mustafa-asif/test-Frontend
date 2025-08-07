import { CityCombobox } from "../../components/shared/CityCombobox";
import { Input } from "../../components/shared/Input";
import { Button } from "../../components/shared/Button";
import { Link } from "react-router-dom";
import { Fragment, useRef, useState } from "react";
import { Stepper } from "../../components/shared/Misc";
import { useEffect } from "react";
import { xGetText, xLogin, xRegister, xVerify } from "../../utils/auth";
import { useToast } from "../../hooks/useToast";
import { getCachedReferrer } from "../../hooks/useLastReferrer";
import { useTranslation } from "../../i18n/provider";
import { brandLogo } from "../../tenant-config";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState({
    phone: "",
    password: "",
    name: "",
    client: {
      location: {
        city: "",
      },
    },
  });
  const [isLoading, setLoading] = useState(false);
  const showToast = useToast();
  const tl = useTranslation();

  return (
    <div
      className="max-w-sm mx-auto bg-white rounded-lg shadow-lg lg:max-w-4xl px-6 py-8 md:px-8 lg:w-1/2"
      style={{
        boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.07), inset 0 -10px 15px 5px rgba(0, 0, 0, 0.05)",
      }}>
      <Link to="/">
        <img className="mx-auto pb-5 max-h-[95px] max-w-[250px]" src={brandLogo} alt="" />
      </Link>

      <h1 className="text-lg md:text-xl text-center pb-4 font-semibold text-gray-700">
        {tl("sign_up_start_delivering")}
      </h1>
      <Stepper max={4} current={step} />

      {step === 1 && (
        <PersoInfo
          fields={fields}
          isLoading={isLoading}
          setFields={setFields}
          setStep={setStep}
          setLoading={setLoading}
        />
      )}
      {step === 2 && (
        <LoginInfo
          fields={fields}
          isLoading={isLoading}
          setFields={setFields}
          setStep={setStep}
          setLoading={setLoading}
          showToast={showToast}
        />
      )}
      {step === 3 && (
        <VerifyCode
          fields={fields}
          isLoading={isLoading}
          setStep={setStep}
          setLoading={setLoading}
          showToast={showToast}
        />
      )}
      {step === 4 && (
        <SuccessStep
          isLoading={isLoading}
          setLoading={setLoading}
          fields={fields}
          showToast={showToast}
        />
      )}

      {window.location.hostname.includes("livo.ma") && (
        <a href="https://wa.me/212675222777" className="float" target="_blank">
          <i className="fab fa-whatsapp my-float"></i>
        </a>
      )}
    </div>
  );
}

function PersoInfo({ fields, isLoading, setFields, setLoading, setStep, showToast }) {
  const tl = useTranslation();
  async function handleSubmit(e) {
    e.preventDefault();
    setStep((step) => step + 1);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-2">
        <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
          {tl("full_name")}
        </label>
        <Input
          value={fields.name}
          onValueChange={(name) => setFields({ ...fields, name })}
          disabled={isLoading}
          placeholder={tl("full_name")}
          required
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
          {tl("city")}
        </label>
        <CityCombobox
          value={fields.client.location.city}
          inputProps={{ placeholder: tl("city") }}
          onValueChange={(city) =>
            setFields({
              ...fields,
              client: { ...fields.client, location: { ...fields.client.location, city } },
            })
          }
        />
      </div>
      <div className="mt-6 mb-4 flex gap-x-3">
        <Button
          label={tl("next")}
          icon="chevron-right"
          iconPosition="right"
          isLoading={isLoading}
        />
      </div>

      <Link to="/login" className="ml-1 text-left text-md font-bold text-link hover:underline">
        {tl("already_have_account")}
      </Link>
    </form>
  );
}
function LoginInfo({ fields, isLoading, setFields, setLoading, setStep, showToast }) {
  const tl = useTranslation();
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await xRegister({ ...fields, referrer_id: getCachedReferrer() });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setStep((step) => step + 1);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-2">
        <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
          {tl("phone")}
        </label>
        <Input
          type="tel"
          pattern="[0-9]*"
          value={fields.phone}
          placeholder="0000000000"
          onChange={(e) => {
            if (e.target.value.length > 10) return;
            if (!e.target.validity.valid && !!e.target.value) return;
            setFields({
              ...fields,
              phone: e.target.value,
            });
          }}
          disabled={isLoading}
          required
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
          {tl("password")}
        </label>
        <Input
          type="password"
          value={fields.password}
          onValueChange={(password) => setFields({ ...fields, password })}
          disabled={isLoading}
          placeholder="********"
          required
        />
      </div>
      <div className="mt-6 mb-4 flex gap-x-4">
        <Button
          className="w-max px-8"
          btnColor="gray"
          label={tl("previous")}
          icon="chevron-left"
          type="button"
          disabled={isLoading}
          onClick={() => setStep((step) => step - 1)}
        />
        <Button
          label={tl("next")}
          icon="chevron-right"
          iconPosition="right"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}

function VerifyCode({ fields, isLoading, setLoading, setStep, showToast }) {
  const tl = useTranslation();
  const [code, setCode] = useState(
    window.location.hostname === "localhost" || window.location.hostname.includes("staging")
      ? "0000"
      : ""
  );
  const [tillResend, setTillResend] = useState(0);
  const [isResending, setResending] = useState(false);
  const timeoutRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await xVerify({ phone: fields.phone, code });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    showToast("Success", "success");
    setStep((step) => step + 1);
  }

  function scheduleCountdown() {
    timeoutRef.current = setTimeout(() => {
      setTillResend((s) => s - 1);
    }, 1000);
  }

  async function handleResend() {
    if (isLoading || isResending) return;
    setTillResend(60);
    setResending(true);
    const { error } = await xGetText({ phone: fields.phone });
    setResending(false);
    if (error) {
      showToast(error, "error");
    }
  }

  useEffect(() => {
    if (tillResend !== 0) {
      scheduleCountdown();
    } else {
    }
  }, [tillResend]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <div className="my-4 mx-2 flex justify-between">
        <p className="text-gray-400">{tl("verify_phone")}</p>
        <p className="text-gray-600 font-bold text-xl">{fields.phone || "0000000000"}</p>
      </div>
      <Input
        placeholder="XXXX"
        value={code}
        onValueChange={setCode}
        maxLength={4}
        className="tracking-widest"
        required
      />
      <div className="my-4 mx-2 flex justify-between">
        <p className="text-gray-400">
          {tl("no_sms")}{" "}
          <span>
            {tillResend > 0 ? (
              <>
                {tl("resend_in")} <b>{tillResend}s</b>
              </>
            ) : (
              <span
                onClick={handleResend}
                className="hover:underline text-green-600 cursor-pointer">
                {tl("resend_now")}
              </span>
            )}{" "}
            {tl("or")}{" "}
            <a
              href="https://wa.me/212675222777?text=Verification+Manuelle"
              className="hover:underline text-green-600 cursor-pointer"
              target="_blank">
              {tl("manual_verification")}
            </a>
          </span>
        </p>
      </div>

      <div className="mt-6 mb-1 flex gap-x-3">
        <Button
          className="w-max px-8"
          btnColor="gray"
          label={tl("previous")}
          icon="chevron-left"
          type="button"
          disabled={isLoading}
          onClick={() => setStep((step) => step - 1)}
        />
        <Button
          label={tl("next")}
          icon="chevron-right"
          iconPosition="right"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}

function SuccessStep({ isLoading, setLoading, fields, showToast }) {
  async function autoLogin() {
    setLoading(true);
    const { error } = await xLogin({ phone: fields.phone, password: fields.password });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setTimeout(() => {
      window.location.replace("/account");
    }, 1000);
  }

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <Fragment>
      <div
        style={{ height: 120, width: 120 }}
        className="transition-shadow duration-300 m-5 rounded-full bg-green-500 mx-auto flex items-center justify-center shadow-md hover:shadow-lg">
        <i className="fas fa-check text-white text-5xl"></i>
      </div>
    </Fragment>
  );
}
