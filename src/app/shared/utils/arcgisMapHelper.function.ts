import MapView from '@arcgis/core/views/MapView';
export const clearDisplay = (view: MapView) => {
  view.closePopup();
  view.graphics.removeAll();
};
export const displayResults = (
  view: MapView,
  features: any[],
  color: number[],
  boundaryNumber: number
) => {
  // Create a blue polygon
  const symbol = {
    type: 'simple-fill',
    color,
    outline: {
      color: 'white',
      width: 0.5,
    },
  };

  const fieldNames = ['adm0_name', 'adm1_name', 'adm2_name'];

  const popupTemplate = {
    title: `Administative Boundaries ${boundaryNumber}`,
    content: fieldNames
      .filter((_, index) => index < boundaryNumber)
      .map((fieldName) => `${fieldName}: <b>{${fieldName}}</b>`)
      .join('<br>'),
  };

  // Assign styles and popup to features
  features.map((feature: any) => {
    feature.symbol = symbol;
    feature.popupTemplate = popupTemplate;
    return feature;
  });

  // Add features to graphics layer
  view.graphics.addMany(features);
};

export const computeExtentFromFeatures = (features: any) => {
  return features.reduce((acc: any, feature: any) => {
    return acc.union(feature.geometry.extent);
  }, features[0]?.geometry.extent);
};

export const moveMapToExtent = (view: MapView, extent: any) => {};

export const generateWhereInStatment = (
  columnName: string,
  values: string[]
) => {
  const whereInArguments = values
    .map((e) => `'${e.replaceAll(/'/g, "''")}'`)
    .join(', ');
  return `${columnName} IN (${whereInArguments})`;
};
