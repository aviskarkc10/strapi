import React from 'react';
import { useHistory } from 'react-router-dom';
import { get, has } from 'lodash';
import { ViewContainer } from 'strapi-helper-plugin';
import useDataManager from '../../hooks/useDataManager';
import LeftMenu from '../LeftMenu';

const ListPage = () => {
  const {
    components,
    initialData,
    modifiedData,
    isInContentTypeView,
  } = useDataManager();
  const { push } = useHistory();

  const attributes = get(modifiedData, ['schema', 'attributes'], {});
  const currentDataName = get(initialData, ['schema', 'name'], '');

  const handleClick = () => {
    const forTarget = isInContentTypeView ? 'contentType' : 'component';
    const search = `modalType=chooseAttribute&forTarget=${forTarget}&target=${currentDataName}`;
    push({ search });
  };
  // TODO just a util not sure it should be kept
  const getType = attrName => {
    const type = has(modifiedData, ['schema', 'attributes', attrName, 'nature'])
      ? 'relation'
      : get(modifiedData, ['schema', 'attributes', attrName, 'type'], '');

    return type;
  };
  const getComponentSchema = attrName => {
    const componentToGet = get(
      modifiedData,
      ['schema', 'attributes', attrName, 'component'],
      ''
    );
    const componentSchema = get(
      components,
      [componentToGet, 'schema', 'attributes'],
      {}
    );

    return componentSchema;
  };
  const handleClickEditField = (forTarget, target, attrName, type) => {
    const attributeType = [
      'integer',
      'biginteger',
      'decimal',
      'float',
    ].includes(type)
      ? 'number'
      : type;

    push({
      search: `modalType=attribute&actionType=edit&settingType=base&forTarget=${forTarget}&target=${target}&attributeName=${attrName}&attributeType=${attributeType}`,
    });
  };

  console.log({ ctSchema: modifiedData });

  return (
    <ViewContainer>
      <div className="container-fluid">
        <div className="row">
          <LeftMenu />
          <div className="col-md-9">
            <button type="button" onClick={handleClick}>
              Add field
            </button>

            {/* REALLY TEMPORARY SINCE IT DOESN T SUPPORT ANY NESTING COMPONENT*/}
            <ul>
              {Object.keys(attributes).map(attr => {
                const type = getType(attr);

                if (type === 'component') {
                  const componentSchema = getComponentSchema(attr);
                  // TODO edit component field name & other stuff
                  // TODO edit component's fields
                  return (
                    <li key={attr}>
                      <span>{attr}</span>
                      &nbsp:
                      <span>component</span>
                      <ul>
                        {Object.keys(componentSchema).map(componentAttr => {
                          const componentAttrType = get(
                            componentSchema,
                            [componentAttr, 'type'],
                            ''
                          );

                          return (
                            <li key={`${attr}.${componentAttr}`}>
                              <span>{componentAttr}</span>
                              &nbsp;
                              <span>{componentAttrType}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li
                    key={attr}
                    onClick={() =>
                      handleClickEditField(
                        'contentType',
                        currentDataName,
                        attr,
                        type
                      )
                    }
                  >
                    <span>{attr}</span>
                    &nbsp;
                    <span>{type}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </ViewContainer>
  );
};

export default ListPage;