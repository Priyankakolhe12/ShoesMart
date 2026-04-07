import { Controller } from "react-hook-form";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function FormInput({ control, name, label, type = "text" }) {
  const [show, setShow] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          margin="normal"
          error={!!error}
          helperText={error?.message}
          type={type === "password" ? (show ? "text" : "password") : type}
          InputProps={
            type === "password"
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow(!show)}>
                        {show ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        />
      )}
    />
  );
}
