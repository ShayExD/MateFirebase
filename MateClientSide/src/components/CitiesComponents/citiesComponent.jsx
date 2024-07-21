import SelectDropdown from 'react-native-select-dropdown'
import IsraelCities from '../../utils/citiesInIsrael';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput,KeyboardAvoidingView ,Platform} from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { VerticalScale } from '../../utils';
import Theme from '../../../assets/styles/theme';

const CitiesComponent = ({onSelectCity,defualtOptionCheck}) => {
    const [selected, setSelected]  = useState('');

    const preprocessedData = IsraelCities.map(city => ({
        key: `${city.name} (${city.english_name})`,
        value: city.name,
        englishName: city.english_name,
      }));

      const handleSelectCity = (city) => {
        setSelected(city);
        onSelectCity(city);
      };

  return (
     <View style={styles.container}>
     <SelectList 
        setSelected={handleSelectCity} 
        data={preprocessedData} 
        boxStyles={{
            direction: 'rtl',
            textAlign: 'center',
            minWidth: '100%',
            alignItems:'center'
          }}
          dropdownStyles={{
            textAlign: 'right',
            alignItems: 'flex-end'
          }}
          dropdownItemStyles={{
            textAlign:'right',
            alignItems:'flex-end'
          }}
          defaultOption={defualtOptionCheck ? defualtOptionCheck: ""}
        save="value"
        search={true}
        placeholder={defualtOptionCheck? defualtOptionCheck: 'עיר בישראל'}
        inputStyles={[Theme.primaryText,{textAlign:'right',marginHorizontal:0}]}
        renderItem={(item, styleProps) => (
        <View style={styleProps.listItemContainer}>
        <Text style={styleProps.listItemLabel}>{`${item.value}`}</Text>
        </View>
        )}
    />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignItems: 'center',
        marginBottom: VerticalScale(24),
        justifyContent:'flex-end'
    
      },
    inputStyle: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        fontFamily:Theme.primaryText.fontFamily
      },
});

export default CitiesComponent