import ReactDOM from "react-dom";
import IncidentReport, {
  IncidentCategory,
  Box,
  Notifications,
} from "./incidentReport";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteContext, IrDashboardContext } from "../SiteContext";
import { preventability } from "../config";

const customRender = async (ui, { providerProps, renderState, ...renderOptions }) => {
  return await act(async () => {
    await render(
      <MemoryRouter initialEntries={[
        renderState
      ]}>
        <SiteContext.Provider value={providerProps}>
          <IrDashboardContext.Provider
            value={{
              count: {},
              irScreenDetails: [
                {
                  id: 5,
                  enableDisable: true,
                  rulesPeriod: 'day'
                },
                {
                  id: 2,
                  enableDisable: true
                }
              ],
            }}
          >
            {ui}
          </IrDashboardContext.Provider>
        </SiteContext.Provider>
      </MemoryRouter>,
      renderOptions
    );
  });
};

const setMockFetch = (data, status) => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    json: jest.fn().mockResolvedValue(data),
    status: status || 200,
  });
};

describe("Incident Report Form", () => {
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
  });
  beforeEach(async () => {
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

    const providerProps = {
      user: { id: 10, name: "Test User", department: 3 },
      endpoints: {
        locations: "http://endpoints.com/locations",
        users: "http://endpoints.com/users",
        departments: "http://endpoints.com/departments",
      },
    };
    await customRender(<IncidentReport />, { providerProps });
  });

  test("Context test", async () => {
    const comp = await screen.getByTestId("incidentReportingForm");
    expect(comp.textContent).toMatch(
      "There is a blame free reporting culture. No punitive measure will be taken against any staff reporting any incident"
    );
    expect(comp.textContent).toMatch("INCIDENT DESCRIPTION");
    expect(comp.textContent).toMatch("ClearSaveSubmit");

    const actionTaken_add = document.querySelector(
      `div[data-testid="actionTakenBtns"] button[type="submit"]`
    );
    await act(async () => {
      await fireEvent.click(actionTaken_add);
    });
  });

  test("Reset form", async () => {
    const resetBtn = await screen.getByText("Clear");
    await act(async () => {
      await fireEvent.click(resetBtn);
    });
    const btn = document.querySelector(".box .head button");
    await act(async () => {
      await fireEvent.click(btn);
    });

    const btn2 = document.querySelector(".box .head button");
  });

  test("Set notification", async () => {
    const notified = document.querySelector(".notified");
    expect(notified.textContent).toMatch("NameDepartmentDate");
  });

  test("incident_Date_Time", async () => {
    const dateTimeInput = screen.getByLabelText('Incident Date & Time *');
    await act(async () => {
      await fireEvent.change(dateTimeInput, {
        target: { value: "2020-05-12T20:20" },
      });
    });
  });

  test("irForm clear", async () => {
    const clearBtn = screen.getByText('Clear');
    await act(async () => {
      await fireEvent.click(clearBtn);
    });
  });

  test("irForm Save", async () => {
    const saveBtn = screen.getByText('Save');
    await act(async () => {
      await fireEvent.click(saveBtn);
    });
  });

  test("irForm Submit", async () => {
    const submitBtn = screen.getByText('Submit');
    await act(async () => {
      await fireEvent.click(submitBtn);
    });
  });

  test("change patient toggle", async () => {
    const switchInput = screen.getByTestId('switchInput').querySelector('input');
    await act(async () => {
      await fireEvent.click(switchInput);
      expect(screen.getByLabelText('Complaint Date & Time *')).toBeDefined();
    });
  })
});

describe("Incident Report Form Edit", () => {
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
  });
  beforeEach(async () => {
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

    const providerProps = {
      user: { id: 10, name: "Test User", department: 3 },
      endpoints: {
        locations: "http://endpoints.com/locations",
        users: "http://endpoints.com/users",
        departments: "http://endpoints.com/departments",
      },
    };
    await customRender(<IncidentReport />, { providerProps, renderState: {
      state: {
        edit: {
          preventability
        }
      }
    }});
  });

  test("irForm save - edit", async () => {
    const saveBtn = screen.getByText('Save');
    await act(async () => {
      await fireEvent.click(saveBtn);
    });
  });

  test("complaIntegerDatetime validate", async () => {
    const switchInput = screen.getByTestId('switchInput').querySelector('input');
    await act(async () => {
      await fireEvent.click(switchInput);
    });
    const dateTimeInput = screen.getByLabelText('Complaint Date & Time *');
    const date = new Date();
    date.setDate(date.getDate() + 1);

    await act(async () => {
      await fireEvent.change(dateTimeInput, {
        target: { value: date },
      });
    });
  });
});
