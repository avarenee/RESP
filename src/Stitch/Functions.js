import React from 'react';
import {stitchClient, found, missing} from './../Stitch/Database';

export function addFound(event, personToAdd) {
  event.preventDefault();
  found.insertOne(personToAdd);
}

export function updateFound(event, personToUpdate) {
  event.preventDefault();
  found.insertOne(personToUpdate);
}

export function addMissing(event, personToAdd) {
  event.preventDefault();
  missing.insertOne(personToAdd);
}

export function removeMissing(event, personToRemove) {
  event.preventDefault();
  missing.deleteOne(personToRemove);
}

export function findMissing(event, personToFind) {
  event.preventDefault();
  missing.find(personToFind);
}

export function findByCampsite(event, campsiteToSearch) {
  event.preventDefault();
  missing.find(campsiteToSearch);
}
