import { Controller } from "react-hook-form";
import { TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { useState, memo } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function FormInput({
  control,
  name,
  label,
  type = "text",
  options = [],
  rules = {},
  disabled = false,
  startIcon,
  maxLength,
  ...props
}) {
  const [show, setShow] = useState(false);

  const isPassword = type === "password";
  const isSelect = type === "select";
  const isTextarea = type === "textarea";
  const isNumber = type === "number";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          fullWidth
          label={label}
          variant="outlined"
          size="medium"
          margin="normal"
          error={!!error}
          helperText={error?.message || " "}
          select={isSelect}
          multiline={isTextarea}
          rows={isTextarea ? 3 : undefined}
          disabled={disabled}
          inputProps={{ maxLength }}
          type={
            isPassword
              ? show
                ? "text"
                : "password"
              : isNumber
                ? "number"
                : "text"
          }
          value={field.value ?? ""}
          onChange={(e) => {
            let value = e.target.value;

            if (isNumber) {
              value = value === "" ? "" : Number(value);
            }

            field.onChange(value);
          }}
          InputProps={{
            ...(startIcon && {
              startAdornment: (
                <InputAdornment position="start">{startIcon}</InputAdornment>
              ),
            }),

            ...(isPassword && {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShow((prev) => !prev)}
                    edge="end"
                  >
                    {show ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }),
          }}
        >
          {isSelect &&
            options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}

export default memo(FormInput);
