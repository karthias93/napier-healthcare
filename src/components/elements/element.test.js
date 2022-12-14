import ReactDOM from "react-dom";
import {
  Input,
  FileInput,
  Textarea,
  Radio,
  CustomRadio,
  SwitchInput,
  Toggle,
  Combobox,
  Checkbox,
  Moment,
  Chip,
  Tabs,
  MobileNumberInput,
  FishboneDiagram,
} from "./";
import { TableActions, Table } from "./Table";
import { BrowserRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("input", async () => {
  render(<Input type="text" placeholder="input-placeholder" />);
  const input = await screen.getByPlaceholderText("input-placeholder");
  expect(input.placeholder).toBe("input-placeholder");
});
test("FileInput", async () => {
  render(<FileInput label="Files" />);
  const fileInput = await screen.getByTestId("fileInput");
  expect(fileInput.textContent).toBe("Files 0 files selectedItem select");

  const input = document.querySelector("input");
  fireEvent.click(input);
});
test("Textarea", async () => {
  render(<Textarea type="text" placeholder="textarea" />);
  const textarea = await screen.getByPlaceholderText("textarea");
  expect(textarea.placeholder).toBe("textarea");
});
test("Radio", async () => {
  render(
    <Radio
      name="typeofInci"
      options={[
        {
          label: "Option 1",
          value: "1",
          hint: "Hint for option 1",
        },
        {
          label: "Option 2",
          value: "2",
          hint: "Hint for option 2",
        },
      ]}
    />
  );
  const container = await screen.getByTestId("radioInput");
  expect(container.textContent).toBe(
    "Option 1Hint for option 1Option 2Hint for option 2"
  );
});
test("CustomRadio", async () => {
  render(
    <CustomRadio
      label="Custom Radio"
      options={[
        {
          label: "Option 1",
          value: "1",
        },
        {
          label: "Option 2",
          value: "2",
        },
      ]}
    />
  );
  const container = await screen.getByTestId("customRadioInput");
  expect(container.textContent).toBe("Custom Radio Option 1Option 2");
});
test("Switch", async () => {
  render(<SwitchInput label="Switch" />);
  const input = await screen.getByTestId("switchInput");
  const switchBtn = input.querySelector('.btns');
  await fireEvent.keyDown(switchBtn, {keyCode: 32});
  await fireEvent.keyDown(switchBtn, {keyCode: 39});
  await fireEvent.keyDown(switchBtn, {keyCode: 37});
  expect(input.textContent).toBe("Switch YesNo");
});
test("Toggle", async () => {
  render(<Toggle label="Switch" />);
  const input = await screen.getByTestId("toggleInput");
  await fireEvent.keyDown(input, {keyCode: 32});
  await fireEvent.keyDown(input, {keyCode: 39});
  await fireEvent.keyDown(input, {keyCode: 37});
  expect(input.textContent).toBe("");
});
test("Checkbox", async () => {
  render(<Checkbox label="Switch" />);
  const time = await screen.getByTestId("checkbox-input");
  expect(time.textContent).toBe("Switch");
});
describe("Table Actions", () => {
  beforeAll(async () => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
    let portal = document.querySelector("#portal");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "portal";
      document.body.appendChild(portal);
    }

    let prompt = document.querySelector("#prompt");
    if (!prompt) {
      const prompt = document.createElement("div");
      prompt.id = "prompt";
      document.body.appendChild(prompt);
    }
  });
  test("2 actions", async () => {
    await act(async () =>
      render(
        <table>
          <tbody>
            <tr>
              <TableActions
                actions={[
                  { icon: "Icon 1", label: "Action 1", callBack: () => {} },
                  { icon: "Icon 2", label: "Action 2", callBack: () => {} },
                ]}
              />
            </tr>
          </tbody>
        </table>
      )
    );
    const container = await screen.getByTestId("tableActions");
    expect(container.textContent).toBe("Icon 1Icon 2");
  });
  test("4 actions", async () => {
    await act(async () =>
      render(
        <table>
          <tbody>
            <tr>
              <TableActions
                actions={[
                  { icon: "Icon 1", label: "Action 1", callBack: () => {} },
                  { icon: "Icon 2", label: "Action 2", callBack: () => {} },
                  { icon: "Icon 3", label: "Action 3", callBack: () => {} },
                  { icon: "Icon 4", label: "Action 4", callBack: () => {} },
                  { icon: "Icon 5", label: "Action 5", callBack: () => {} },
                ]}
              />
            </tr>
          </tbody>
        </table>
      )
    );
    const gearBtn = await screen.getByTestId("gear-btn");
    fireEvent.click(gearBtn);

    const opt1 = document.querySelector(".modal button");
    fireEvent.click(opt1);

    fireEvent.click(gearBtn);
    const backdrop = document.querySelector(".modalBackdrop");
    fireEvent.click(backdrop);
  });
  test("Table", async () => {
    await act(async () =>
      render(
        <Table
          columns={[{ label: "Label 1" }, { label: "Label 2" }]}
          sortable={true}
        >
          <tr>
            <td>Name</td>
            <td>Email</td>
          </tr>
          <tr>
            <td>Name 2</td>
            <td>Email 2</td>
          </tr>
        </Table>
      )
    );
  });
});
test("Moment", async () => {
  const component = render(
    <Moment format="DD/MM/YYYY ddd hh:mm">
      {new Date("2021-05-12 13:45")}
    </Moment>
  );
  const time = await screen.getByTestId("moment");
  expect(time.textContent).toBe("12/05/2021 Wed 13:45");
});
test("Invalid Date", async () => {
  const component = render(
    <Moment format="DD/MM/YYYY ddd hh:mm">{"1agdasdgsd33"}</Moment>
  );
  const time = await screen.getByTestId("moment");
  expect(time.textContent).toBe("1agdasdgsd33");
});
test("Chip", () => {
  const component = render(<Chip label="test chip" remove={jest.fn()} />);
  const button = document.querySelector("button.clear");
  fireEvent.click(button);
});
test("Tabs", () => {
  const component = render(
    <BrowserRouter>
      <Tabs
        tabs={[
          { path: "/admin/path-1", label: "Path 1" },
          { path: "/admin/path-2", label: "Path 2" },
        ]}
      />
    </BrowserRouter>
  );
  const a = document.querySelector("a");
  fireEvent.click(a);
});
test("Fishbone Diagram", () => {
  const component = render(
    <FishboneDiagram
      data={{
        Equipment: {
          Broken: {
            causeCat: 14,
            cause: 17,
            why: "asdgasd|asdgasdg|asdg",
            id: "t0258g0o",
            action: "add",
            whys: ["asdgasd", "asdgasdg", "asdg"],
          },
        },
        Environment: {
          Clocks: {
            causeCat: 4,
            cause: 6,
            why: "asdgasdg",
            id: "5h05voug",
            action: "add",
            whys: ["asdgasdg"],
          },
        },
        People: {
          Escort: {
            causeCat: 3,
            cause: 4,
            why: "sd asdg|asdg asdg asdg",
            id: "08a9hfio",
            action: "add",
            whys: ["sd asdg", "asdg asdg asdg"],
          },
          Pholebotomist: {
            causeCat: 3,
            cause: 5,
            why: "asdg asdg",
            id: "fluo69fp",
            action: "add",
            whys: ["asdg asdg"],
          },
          Secretary: {
            causeCat: 3,
            cause: 3,
            why: "asdg asdg|asd gasd gsdg|asdg asdgsdg sdg",
            id: "5gov9c9o",
            action: "add",
            whys: ["asdg asdg", "asd gasd gsdg", "asdg asdgsdg sdg"],
          },
        },
      }}
    />
  );
});

const Form = () => {
  const { handleSubmit, register, setValue, watch, clearErrors } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => {})}>
      <MobileNumberInput
        name="number"
        required={true}
        register={register}
        error={null}
        clearErrors={clearErrors}
        setValue={setValue}
        watch={watch}
      />
    </form>
  );
};

describe("Form", () => {
  beforeAll(async () => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
    let portal = document.querySelector("#portal");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "portal";
      document.body.appendChild(portal);
    }

    let prompt = document.querySelector("#prompt");
    if (!prompt) {
      const prompt = document.createElement("div");
      prompt.id = "prompt";
      document.body.appendChild(prompt);
    }

    await act(async () => render(<Form />));
  });
  test("Plain render", async () => {
    const container = document.querySelector("section");

    const arrow = await screen.getByTestId("combobox-btn");
    await act(async () => {
      await fireEvent.click(arrow);
    });

    const country = document.querySelector(".modal ul li");
    await act(async () => {
      await fireEvent.click(country);
    });

    await act(async () => {
      await fireEvent.click(arrow);
    });

    let input = document.querySelector(
      `section[data-testid="mobileNumberInput"] > div > span > input`
    );
    await act(async () => {
      await fireEvent.click(input);
    });

    await act(async () => {
      await userEvent.type(input, "+8801989479749");
    });
    expect(input.value).toBe("+8801989479749");
  });
});
