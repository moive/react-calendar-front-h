import Swal from "sweetalert2";

import { types } from "../types/types";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";

const convertDateToISO = (date) => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === "string") {
    return date;
  }
  return date;
};

const convertISOToDate = (dateString) => {
  if (typeof dateString === "string") {
    return new Date(dateString);
  }
  if (dateString instanceof Date) {
    return dateString;
  }
  return dateString;
};

export const eventStartAddNew = (event) => {
  return async (dispatch, getState) => {
    const { uid, name } = getState().auth;

    try {
      // Convert Date objects to ISO strings for server
      const eventData = {
        ...event,
        start: convertDateToISO(event.start),
        end: convertDateToISO(event.end),
      };

      const resp = await fetchConToken("events", eventData, "POST");
      const body = await resp.json();

      if (body.ok) {
        // Create event with Date objects for Redux (for react-big-calendar compatibility)
        const eventToStore = {
          id: body.evento.id,
          title: event.title,
          notes: event.notes,
          start: convertISOToDate(event.start),
          end: convertISOToDate(event.end),
          user: {
            _id: uid,
            name: name,
          },
        };

        dispatch(eventAddNew(eventToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const eventAddNew = (event) => ({
  type: types.eventAddNew,
  payload: event,
});

export const eventSetActive = (event) => ({
  type: types.eventSetActive,
  payload: event,
});

export const eventClearActiveEvent = () => ({ type: types.eventClearActiveEvent });

export const eventStartUpdate = (event) => {
  return async (dispatch) => {
    try {
      // Convert Date objects to ISO strings for server
      const eventData = {
        ...event,
        start: convertDateToISO(event.start),
        end: convertDateToISO(event.end),
      };

      const resp = await fetchConToken(`events/${event.id}`, eventData, "PUT");
      const body = await resp.json();

      if (body.ok) {
        // Create event with Date objects for Redux (for react-big-calendar compatibility)
        const eventToStore = {
          id: event.id,
          title: event.title,
          notes: event.notes,
          start: convertISOToDate(event.start),
          end: convertISOToDate(event.end),
          user: event.user,
        };
        dispatch(eventUpdated(eventToStore));
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const eventUpdated = (event) => ({
  type: types.eventUpdated,
  payload: event,
});

export const eventStartDelete = () => {
  return async (dispatch, getState) => {
    const { id } = getState().calendar.activeEvent;
    try {
      const resp = await fetchConToken(`events/${id}`, {}, "DELETE");
      const body = await resp.json();

      if (body.ok) {
        dispatch(eventDeleted());
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const eventDeleted = () => ({ type: types.eventDeleted });

export const eventStartLoading = () => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken("events");
      const body = await resp.json();

      const events = prepareEvents(body.eventos);
      dispatch(eventLoaded(events));
    } catch (error) {
      console.log(error);
    }
  };
};

const eventLoaded = (events) => ({
  type: types.eventLoaded,
  payload: events,
});

export const eventLogout = () => ({ type: types.eventLogout });
